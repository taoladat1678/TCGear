const express = require("express");
const connectDb = require("./db");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { randomUUID } = require("crypto");
const { OAuth2Client } = require("google-auth-library");
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const session = require('express-session');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

// ======================= SERVE STATIC IMAGES =======================
app.use("/img", express.static(path.join(__dirname, "public/img")));

// ======================= FIX CACHE =======================
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

// JWT Config
const JWT_SECRET = process.env.JWT_SECRET || "tcgear-super-secret-key-2026-change-this-in-production";
const JWT_EXPIRES_IN = "7d";

// ======================= GOOGLE CONFIG =======================
const GOOGLE_CLIENT_ID = "973827648524-lhn84q1r885u537rnmttd8pktj1gpq7o.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";
const REDIRECT_URI = "http://localhost:5173";
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, REDIRECT_URI);

// ======================= FACEBOOK CONFIG =======================
const FACEBOOK_APP_ID = "2008061433256961";
const FACEBOOK_APP_SECRET = "031c720804c44b2132b72cebe33c4d08";

app.use(session({
  secret: 'tcgear-facebook-session-secret-change-this-2026',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // true khi deploy https
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new FacebookStrategy({
  clientID: FACEBOOK_APP_ID,
  clientSecret: FACEBOOK_APP_SECRET,
  callbackURL: 'http://localhost:3000/api/user/facebook/callback',
  profileFields: ['id', 'name', 'picture.type(large)'], // loại bỏ 'emails' vì không cần nữa
  state: true
},
async (accessToken, refreshToken, profile, done) => {
  console.log('Facebook profile nhận được:', profile); // Log để debug
  try {
    const facebookId = profile.id;
    
    // Không cần email thật nữa - fallback fake
    const email = `${facebookId}@facebook.placeholder.com`;
    
    const name = profile.name ? `${profile.name.givenName || ''} ${profile.name.familyName || ''}`.trim() || profile.displayName : 'User';
    const picture = profile.photos && profile.photos[0] ? profile.photos[0].value : 'img/fanT1.jpg';

    let [users] = await db.query(
      'SELECT * FROM users WHERE facebook_id = ? LIMIT 1',  // Chỉ check facebook_id
      [facebookId]
    );
    let user = users[0];

    if (!user) {
      const [[{ count }]] = await db.query('SELECT COUNT(*) AS count FROM users');
      const nextNumber = count + 1;
      const userId = `TCG-USR-${String(nextNumber).padStart(3, '0')}`;
      const fullname = name;
      let baseUsername = removeTone(fullname).replace(/\s+/g, '');
      let username = baseUsername;
      let suffix = 1;
      while (true) {
        const [exists] = await db.query('SELECT user_id FROM users WHERE user_username = ?', [username]);
        if (exists.length === 0) break;
        username = baseUsername + suffix++;
      }

      await db.query(
        `INSERT INTO users
         (user_id, user_fullname, user_username, user_email, user_image, facebook_id, user_isActive, user_isAdmin, user_password)
         VALUES (?, ?, ?, ?, ?, ?, 1, 0, ?)`,
        [userId, fullname, username, email, picture, facebookId, '']
      );

      [users] = await db.query('SELECT * FROM users WHERE user_id = ?', [userId]);
      user = users[0];
    } else {
      if (picture && user.user_image !== picture && user.user_image !== 'img/fanT1.jpg') {
        await db.query('UPDATE users SET user_image = ? WHERE user_id = ?', [picture, user.user_id]);
      }
    }

    return done(null, user);
  } catch (err) {
    console.error('Facebook strategy error:', err);
    return done(err);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.user_id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE user_id = ?', [id]);
    done(null, rows[0] || false);
  } catch (err) {
    done(err);
  }
});

// ────────────────────────────────────────────────
// PHẦN ASYNC DB + TẤT CẢ ROUTE
// ────────────────────────────────────────────────
let db;
const removeTone = (str) =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();

(async () => {
  try {
    db = await connectDb();
    console.log("✅ MySQL Connected");

    // ======================= MULTER - LƯU VÀO FRONTEND PUBLIC/IMG =======================
    const upload = multer({
      storage: multer.diskStorage({
        destination: (req, file, cb) => {
          const frontendPublicImgPath = "C:\\Users\\hlua7\\OneDrive\\Desktop\\WEB\\React\\TCGear\\public\\img";
          if (!fs.existsSync(frontendPublicImgPath)) {
            fs.mkdirSync(frontendPublicImgPath, { recursive: true });
          }
          cb(null, frontendPublicImgPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + "-" + file.originalname);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
          cb(null, true);
        } else {
          cb(new Error("File không phải là hình ảnh!"), false);
        }
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    });

    // ======================= GOOGLE LOGIN =======================
      app.post("/api/user/google-login", async (req, res) => {
        console.log("=== GOOGLE LOGIN ĐÃ CHẠM ===");
        const { code } = req.body;

        if (!code) {
          return res.status(400).json({ status: "error", message: "Thiếu code từ Google" });
        }

        try {
          // Bước 1: Đổi code lấy tokens (access_token + id_token + refresh_token nếu có)
          const { tokens } = await googleClient.getToken({
            code,
            redirect_uri: REDIRECT_URI,
          });

          if (!tokens?.access_token) {
            return res.status(400).json({ 
              status: "error", 
              message: "Không lấy được access_token từ Google" 
            });
          }

          console.log("Google tokens nhận được:", tokens);

          // Bước 2: Dùng access_token gọi trực tiếp UserInfo endpoint → CHẮC CHẮN có picture
          const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${tokens.access_token}`,
            },
          });

          if (!userInfoResponse.ok) {
            const errorText = await userInfoResponse.text();
            console.error("Google UserInfo error:", errorText);
            throw new Error(`Google UserInfo thất bại: ${userInfoResponse.status} - ${errorText}`);
          }

          const userInfo = await userInfoResponse.json();
          console.log("Google UserInfo đầy đủ:", userInfo);

          // Các trường quan trọng từ userInfo (đảm bảo có picture)
          const googleId = userInfo.sub;
          const email = userInfo.email;
          const name = userInfo.name || userInfo.given_name || userInfo.family_name || email.split("@")[0];
          const picture = userInfo.picture 
            ? userInfo.picture.replace(/=s\d+-c$/, "=s400-c")  // upscale ảnh lên ~400px nếu muốn đẹp hơn
            : "img/fanT1.jpg";

          // Bước 3: Tìm user trong DB (giống code cũ của bạn)
          let [users] = await db.query(
            "SELECT * FROM users WHERE user_email = ? OR google_id = ? LIMIT 1",
            [email, googleId]
          );
          let user = users[0];

          if (!user) {
            // Tạo user mới
            const [[{ count }]] = await db.query("SELECT COUNT(*) AS count FROM users");
            const nextNumber = count + 1;
            const userId = `TCG-USR-${String(nextNumber).padStart(3, "0")}`;
            const fullname = name;
            let baseUsername = removeTone(fullname).replace(/\s+/g, '');
            let username = baseUsername;
            let suffix = 1;
            while (true) {
              const [exists] = await db.query('SELECT user_id FROM users WHERE user_username = ?', [username]);
              if (exists.length === 0) break;
              username = baseUsername + suffix++;
            }

            await db.query(
              `INSERT INTO users
              (user_id, user_fullname, user_username, user_email, user_image, google_id, user_isActive, user_isAdmin, user_password)
              VALUES (?, ?, ?, ?, ?, ?, 1, 0, ?)`,
              [userId, fullname, username, email, picture, googleId, '']
            );

            [users] = await db.query('SELECT * FROM users WHERE user_id = ?', [userId]);
            user = users[0];
          } else {
            // Update avatar nếu khác (và không phải default)
            if (picture !== "img/fanT1.jpg" && user.user_image !== picture) {
              await db.query('UPDATE users SET user_image = ? WHERE user_id = ?', [picture, user.user_id]);
              user.user_image = picture; // cập nhật object để trả về frontend
            }
          }

          // Bước 4: Tạo JWT và trả về (giống cũ)
          const token = jwt.sign(
            {
              user_id: user.user_id,
              username: user.user_username,
              fullname: user.user_fullname,
              email: user.user_email,
              isAdmin: user.user_isAdmin === 1,
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
          );

          res.json({
            status: "success",
            token,
            user: {
              user_id: user.user_id,
              fullname: user.user_fullname,
              username: user.user_username,
              email: user.user_email,
              phone: user.user_phone_number || null,
              address: user.user_address || null,
              image: user.user_image || picture,  // đảm bảo frontend nhận avatar đúng
              isAdmin: user.user_isAdmin === 1,
            },
          });

        } catch (err) {
          console.error("Google login FULL error:", err);
          res.status(500).json({ 
            status: "error", 
            message: "Lỗi Google login: " + (err.message || "Unknown error") 
          });
        }
      });
    // ======================= FACEBOOK ROUTES =======================
    app.get('/api/user/facebook-login',
      passport.authenticate('facebook', { scope: ['email'] })
    );

    app.get('/api/user/facebook/callback',
      passport.authenticate('facebook', {
        failureRedirect: 'http://localhost:5173/login?error=facebook_failed',
        failureMessage: true
      }),
      (req, res) => {
        console.log('Facebook login success, user:', req.user); // Log để debug
        const user = req.user;

        const token = jwt.sign(
          {
            user_id: user.user_id,
            username: user.user_username,
            fullname: user.user_fullname,
            email: user.user_email,
            isAdmin: user.user_isAdmin === 1,
          },
          JWT_SECRET,
          { expiresIn: JWT_EXPIRES_IN }
        );

        const userData = {
          user_id: user.user_id,
          fullname: user.user_fullname,
          username: user.user_username,
          email: user.user_email,
          image: user.user_image,
          isAdmin: user.user_isAdmin === 1,
        };

        const redirectUrl = `http://localhost:5173/login?token=${token}&user=${encodeURIComponent(JSON.stringify(userData))}`;
        res.redirect(redirectUrl);
      }
    );

    // ======================= REGISTER - FULL DEBUG =======================
    app.post("/api/user/register", upload.single("avatar"), async (req, res) => {
      console.log("=== REGISTER ROUTE ĐÃ CHẠM ===");
      console.log("Has file?", !!req.file);
      console.log("Current __dirname:", __dirname);
      console.log("Save dir:", path.join(__dirname, "public/img"));
      if (req.file) {
        console.log("✅ FILE ĐÃ ĐƯỢC NHẬN:");
        console.log(" - Original:", req.file.originalname);
        console.log(" - Saved as:", req.file.filename);
        console.log(" - Full path:", req.file.path);
      } else {
        console.log("❌ KHÔNG CÓ FILE NÀO!");
        console.log("Body keys:", Object.keys(req.body));
      }
      try {
        const {
          "first-name": firstNameRaw,
          "last-name": lastNameRaw,
          email: emailRaw,
          phone: phoneRaw,
          password: passwordRaw,
          "confirm-password": confirmPasswordRaw,
        } = req.body;
        const firstName = firstNameRaw?.trim();
        const lastName = lastNameRaw?.trim();
        const email = emailRaw?.trim().toLowerCase();
        const phone = phoneRaw?.trim();
        const password = passwordRaw?.trim();
        const confirmPassword = confirmPasswordRaw?.trim();
        if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
          return res.status(400).json({ status: "error", message: "Vui lòng điền đầy đủ các trường bắt buộc" });
        }
        if (password !== confirmPassword) {
          return res.status(400).json({ status: "error", message: "Mật khẩu xác nhận không khớp" });
        }
        if (password.length < 8) {
          return res.status(400).json({ status: "error", message: "Mật khẩu phải có ít nhất 8 ký tự" });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return res.status(400).json({ status: "error", message: "Địa chỉ email không hợp lệ" });
        }
        const cleanPhone = phone.replace(/\s/g, "");
        if (!/^0[1-9]\d{8,9}$|^\+84[1-9]\d{8,9}$/.test(cleanPhone)) {
          return res.status(400).json({ status: "error", message: "Số điện thoại không hợp lệ" });
        }
        const [emailExists] = await db.query("SELECT user_id FROM users WHERE user_email = ?", [email]);
        if (emailExists.length > 0) {
          return res.status(400).json({ status: "error", message: "Email này đã được sử dụng" });
        }
        const [phoneExists] = await db.query("SELECT user_id FROM users WHERE user_phone_number = ?", [cleanPhone]);
        if (phoneExists.length > 0) {
          return res.status(400).json({ status: "error", message: "Số điện thoại này đã được sử dụng" });
        }
        const fullname = `${firstName} ${lastName}`;
        let baseUsername = removeTone(fullname).replace(/\s+/g, "");
        let username = baseUsername;
        let suffix = 1;
        while (true) {
          const [userExists] = await db.query("SELECT user_id FROM users WHERE user_username = ?", [username]);
          if (userExists.length === 0) break;
          username = baseUsername + suffix++;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const [[{ count }]] = await db.query("SELECT COUNT(*) AS count FROM users");
        const nextNumber = count + 1;
        const userId = `TCG-USR-${String(nextNumber).padStart(3, "0")}`;
        let userImage = "img/fanT1.jpg";
        if (req.file) {
          userImage = `img/${req.file.filename}`;
          console.log("userImage sẽ lưu vào DB:", userImage);
        }
        await db.query(
          `INSERT INTO users
          (user_id, user_fullname, user_username, user_password, user_email, user_phone_number, user_address, user_isActive, user_image, user_isAdmin)
          VALUES (?, ?, ?, ?, ?, ?, NULL, 1, ?, 0)`,
          [userId, fullname, username, hashedPassword, email, cleanPhone, userImage]
        );
        const [newUserRows] = await db.query("SELECT * FROM users WHERE user_id = ?", [userId]);
        const newUser = newUserRows[0];
        const token = jwt.sign(
          {
            user_id: newUser.user_id,
            username: newUser.user_username,
            fullname: newUser.user_fullname,
            email: newUser.user_email,
            isAdmin: newUser.user_isAdmin === 1,
          },
          JWT_SECRET,
          { expiresIn: JWT_EXPIRES_IN }
        );
        res.json({
          status: "success",
          message: "Đăng ký thành công",
          token,
          user: {
            user_id: newUser.user_id,
            fullname: newUser.user_fullname,
            username: newUser.user_username,
            email: newUser.user_email,
            phone: newUser.user_phone_number,
            address: newUser.user_address,
            image: newUser.user_image,
            isAdmin: newUser.user_isAdmin === 1,
          },
        });
      } catch (err) {
        console.error("Register error:", err);
        res.status(500).json({ status: "error", message: "Lỗi server khi đăng ký" });
      }
    });

    // ======================= TRANSLATE =======================
    app.post("/api/user/translate", async (req, res) => {
      try {
        const { text, target } = req.body;
        if (!text || !target) {
          return res.status(400).json({ error: "Missing text or target" });
        }
        const response = await fetch("https://libretranslate.de/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            q: text,
            source: "auto",
            target,
            format: "text",
          }),
        });
        const data = await response.json();
        res.json({ result: data.translatedText });
      } catch (err) {
        res.status(500).json({ error: "Translate failed" });
      }
    });

    // ======================= LOGIN =======================
    app.post("/api/user/login", async (req, res) => {
      try {
        const { identifier, password } = req.body;
        if (!identifier || !password) {
          return res.status(400).json({ status: "error", message: "Vui lòng cung cấp username/email và mật khẩu" });
        }
        const [rows] = await db.query(
          `SELECT * FROM users
          WHERE user_username = ? OR user_email = ?
          LIMIT 1`,
          [identifier, identifier]
        );
        if (rows.length === 0) {
          return res.status(401).json({ status: "error", message: "Tài khoản hoặc mật khẩu không đúng" });
        }
        const user = rows[0];
        if (user.user_isActive !== 1) {
          return res.status(403).json({ status: "error", message: "Tài khoản của bạn đã bị khóa" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.user_password);
        if (!isPasswordValid) {
          return res.status(401).json({ status: "error", message: "Tài khoản hoặc mật khẩu không đúng" });
        }
        if (!user.user_image || user.user_image.trim() === "" || user.user_image === "img/default-avatar.jpg") {
          user.user_image = "img/fanT1.jpg";
        }
        const token = jwt.sign(
          {
            user_id: user.user_id,
            username: user.user_username,
            fullname: user.user_fullname,
            email: user.user_email,
            isAdmin: user.user_isAdmin === 1,
          },
          JWT_SECRET,
          { expiresIn: JWT_EXPIRES_IN }
        );
        res.json({
          status: "success",
          message: "Đăng nhập thành công",
          token,
          user: {
            user_id: user.user_id,
            fullname: user.user_fullname,
            username: user.user_username,
            email: user.user_email,
            phone: user.user_phone_number,
            address: user.user_address,
            image: user.user_image,
            isAdmin: user.user_isAdmin === 1,
          },
        });
      } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ status: "error", message: "Lỗi server" });
      }
    });

    app.post("/api/user/test-google", (req, res) => {
      console.log("Đã chạm route test-google", req.body);
      res.json({ status: "ok", message: "Route test OK" });
    });

    // ===================================================================
    // ======================= GET RESPONSES BY PRODUCT ID ===============
    // ===================================================================
    app.get("/api/user/responses/:productId", async (req, res) => {
      try {
        const { productId } = req.params;
        const [rows] = await db.query(
          `SELECT
             r.response_id,
             r.cmt_id,
             r.response_text,
             r.create_at,
             r.user_id,
             u.user_fullname,
             u.user_image,
             u.user_isAdmin
           FROM responses r
           LEFT JOIN users u ON r.user_id = u.user_id
           WHERE r.product_id = ?
           ORDER BY r.create_at DESC`,
          [productId]
        );
        res.json({ status: 'success', data: rows });
      } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Server error' });
      }
    });

    // ===================================================================
    // ======================= GET COMMENTS BY PRODUCT ID ================
    // ===================================================================
    app.get("/api/user/comments/:productId", async (req, res) => {
      const { productId } = req.params;
      const [rows] = await db.query(`
        SELECT
          c.*,
          u.user_image,
          u.user_fullname,
          u.user_isAdmin
        FROM comments c
        LEFT JOIN users u ON c.user_id = u.user_id
        WHERE c.product_id = ?
        ORDER BY c.created_at DESC
      `, [productId]);
      res.json({ status: "success", data: rows });
    });

    // ===================================================================
    // ======================= API POST RESPONSES ========================
    // ===================================================================
    app.post("/api/user/responses", async (req, res) => {
      try {
        const { userId, productId, cmtId, responseText, parentResponseId } = req.body;
        if (!productId || !responseText || (!cmtId && !parentResponseId)) {
          return res.status(400).json({ status: "error", message: "Missing required fields" });
        }
        let finalCmtId = cmtId;
        if (parentResponseId) {
          const [parent] = await db.query(
            "SELECT cmt_id FROM responses WHERE response_id = ? AND product_id = ?",
            [parentResponseId, productId]
          );
          if (parent.length === 0) {
            return res.status(404).json({ status: "error", message: "Parent response not found" });
          }
          finalCmtId = parent[0].cmt_id;
        }
        const responseId = `TCG-RSP-${randomUUID().split("-")[0]}`;
        await db.query(
          `INSERT INTO responses
           (response_id, user_id, product_id, cmt_id, parent_response_id, response_text, create_at)
           VALUES (?, ?, ?, ?, ?, ?, NOW())`,
          [responseId, userId || null, productId, finalCmtId, parentResponseId || null, responseText]
        );
        res.json({ status: "success", data: { responseId } });
      } catch (err) {
        console.error(err);
        res.status(500).json({ status: "error", message: "Server error" });
      }
    });

    // ===================================================================
    // ======================= API POST COMMENTS =========================
    // ===================================================================
    app.post("/api/user/comments", async (req, res) => {
      try {
        const { userId, productId, rating, commentText, guestName } = req.body;
        if (!productId) {
          return res.status(400).json({ status: "error", message: "Product is required" });
        }
        if (!rating && !commentText) {
          return res.status(400).json({ status: "error", message: "Rating or comment is required" });
        }
        const cmtId = `TCG-CMT-${randomUUID().split("-")[0]}`;
        await db.query(
          `INSERT INTO comments
          (cmt_id, user_id, product_id, rating, cmt_content, guest_name, created_at)
          VALUES (?, ?, ?, ?, ?, ?, NOW())`,
          [
            cmtId,
            userId || null,
            productId,
            rating || null,
            commentText || null,
            guestName || null
          ]
        );
        res.json({ status: "success", data: { cmtId } });
      } catch (err) {
        console.error(err);
        res.status(500).json({ status: "error", message: "Server error" });
      }
    });

    // ======================= NEW ENDPOINT CMT + RES =======================
    app.get("/api/user/reviews/:productId", async (req, res) => {
      try {
        const { productId } = req.params;
        const [comments] = await db.query(`
          SELECT
            c.cmt_id AS id,
            'comment' AS type,
            c.cmt_content AS text,
            c.rating,
            c.guest_name,
            c.created_at,
            u.user_fullname,
            u.user_image,
            u.user_isAdmin
          FROM comments c
          LEFT JOIN users u ON c.user_id = u.user_id
          WHERE c.product_id = ?
          ORDER BY c.created_at DESC
        `, [productId]);
        const [allResponses] = await db.query(`
          SELECT
            r.response_id AS id,
            'response' AS type,
            r.response_text AS text,
            r.create_at,
            r.cmt_id,
            r.parent_response_id,
            u.user_fullname,
            u.user_image,
            u.user_isAdmin
          FROM responses r
          LEFT JOIN users u ON r.user_id = u.user_id
          WHERE r.product_id = ?
          ORDER BY r.create_at ASC
        `, [productId]);
        const responseMap = {};
        allResponses.forEach(r => {
          responseMap[r.id] = { ...r, replies: [] };
        });
        const buildNested = (node) => {
          Object.values(responseMap).forEach(resp => {
            if (resp.parent_response_id === node.id) {
              const child = responseMap[resp.id];
              buildNested(child);
              node.replies.push(child);
            }
          });
          node.replies.sort((a, b) => new Date(a.create_at) - new Date(b.create_at));
        };
        const reviews = comments.map(comment => {
          const replies = [];
          allResponses.forEach(resp => {
            if (resp.cmt_id === comment.id && !resp.parent_response_id) {
              const node = responseMap[resp.id];
              buildNested(node);
              replies.push(node);
            }
          });
          replies.sort((a, b) => new Date(a.create_at) - new Date(b.create_at));
          return { ...comment, replies };
        });
        res.json({ status: "success", data: reviews });
      } catch (err) {
        console.error(err);
        res.status(500).json({ status: "error", message: "Server error" });
      }
    });

    // ======================= VARIANTS =======================
    app.get("/api/user/variants/products/gear/:productId/:colorId", async (req, res) => {
      const { productId, colorId } = req.params;
      const [rows] = await db.query(`
        SELECT v.*, c.color_name, c.color_code
        FROM variants v
        INNER JOIN colors c ON v.color_id = c.color_id
        WHERE v.product_id = ? AND v.color_id = ?
        LIMIT 1
      `, [productId, colorId]);
      if (rows.length === 0) {
        return res.json({ status: "success", data: null });
      }
      res.json({ status: "success", data: rows[0] });
    });

    app.get("/api/user/variants/products/jersey/:productId/:sizeId", async (req, res) => {
      const { productId, sizeId } = req.params;
      const [rows] = await db.query(`
        SELECT v.*, s.size_name
        FROM variants v
        INNER JOIN sizes s ON v.size_id = s.size_id
        WHERE v.product_id = ? AND v.size_id = ?
        LIMIT 1
      `, [productId, sizeId]);
      if (rows.length === 0) {
        return res.json({ status: "success", data: null });
      }
      res.json({ status: "success", data: rows[0] });
    });

    // ======================= BLOGS =======================
    app.get("/api/user/blogs/:blogId", async (req, res) => {
      const [rows] = await db.query(`
        SELECT blogs.*, bc.blog_cate_name
        FROM blogs
        INNER JOIN blog_categories bc
          ON blogs.blog_cate_id = bc.blog_cate_id
        WHERE blogs.blog_id = ?
      `, [req.params.blogId]);
      if (rows.length === 0) {
        return res.status(404).json({ status: "error", message: "Blog not found" });
      }
      res.json({ status: "success", data: rows[0] });
    });

    app.get("/api/user/blogs/blog-cate/:blogCateId", async (req, res) => {
      const [rows] = await db.query(`
        SELECT blogs.*, bc.blog_cate_name
        FROM blogs
        INNER JOIN blog_categories bc
          ON blogs.blog_cate_id = bc.blog_cate_id
        WHERE blogs.blog_cate_id = ?
      `, [req.params.blogCateId]);
      res.json({ status: "success", data: rows });
    });

    // ======================= TEAM PLAYERS =======================
    app.get("/api/user/team-players/:teamId", async (req, res) => {
      const [rows] = await db.query(`
        SELECT tp.*
        FROM teams_players tp
        INNER JOIN teams t ON tp.team_id = t.team_id
        WHERE tp.team_id = ?
      `, [req.params.teamId]);
      res.json({ status: "success", data: rows });
    });

    // ======================= PRODUCTS =======================
    app.get("/api/user/products", async (req, res) => {
      const [rows] = await db.query(`
        SELECT p.*, MIN(v.price) AS product_price
        FROM products p
        INNER JOIN variants v ON p.product_id = v.product_id
        GROUP BY p.product_id
      `);
      res.json({ status: "success", data: rows });
    });

    app.get("/api/user/products/search/:keyword", async (req, res) => {
      let keyword = req.params.keyword?.trim();
      if (!keyword) return res.json({ status: "success", data: [] });
      keyword = decodeURIComponent(keyword);
      const kw = keyword.toLowerCase();
      const kwNoTone = removeTone(keyword);
      const [rows] = await db.query(`
        SELECT p.*, MIN(v.price) AS product_price
        FROM products p
        INNER JOIN variants v ON p.product_id = v.product_id
        WHERE LOWER(p.product_name) LIKE ?
           OR LOWER(p.product_name) LIKE ?
        GROUP BY p.product_id
        LIMIT 12
      `, [`%${kw}%`, `%${kwNoTone}%`]);
      res.json({ status: "success", count: rows.length, data: rows });
    });

    app.get("/api/user/products/rating/:type", async (req, res) => {
      let minR = 0, maxR = 5;
      switch (req.params.type) {
        case "5": minR = 5; maxR = 5; break;
        case "4plus": minR = 4; maxR = 5; break;
        case "3plus": minR = 3; maxR = 4; break;
        case "1-2": minR = 1; maxR = 2; break;
        default:
          return res.status(400).json({ status: "error", message: "Invalid rating type" });
      }
      const [rows] = await db.query(`
        SELECT p.*, MIN(v.price) AS product_price
        FROM products p
        INNER JOIN variants v ON p.product_id = v.product_id
        WHERE p.product_rating BETWEEN ? AND ?
        GROUP BY p.product_id
        ORDER BY p.product_rating DESC
      `, [minR, maxR]);
      res.json({ status: "success", count: rows.length, data: rows });
    });

    app.get("/api/user/products/price-range/:min/:max", async (req, res) => {
      const min = parseInt(req.params.min) || 0;
      const max = parseInt(req.params.max) || 999999999;
      const [rows] = await db.query(`
        SELECT p.*, MIN(v.price) AS product_price
        FROM products p
        INNER JOIN variants v ON p.product_id = v.product_id
        GROUP BY p.product_id
        HAVING MIN(v.price) BETWEEN ? AND ?
      `, [min, max]);
      res.json({ status: "success", count: rows.length, data: rows });
    });

    app.get("/api/user/products/brands/:brandId", async (req, res) => {
      const [rows] = await db.query(`
        SELECT p.*, MIN(v.price) AS product_price
        FROM products p
        INNER JOIN variants v ON p.product_id = v.product_id
        WHERE p.brand_id = ?
        GROUP BY p.product_id
      `, [req.params.brandId]);
      res.json({ status: "success", count: rows.length, data: rows });
    });

    app.get("/api/user/products/categories/:id", async (req, res) => {
      const [rows] = await db.query(`
        SELECT p.*, MIN(v.price) AS product_price
        FROM products p
        INNER JOIN variants v ON p.product_id = v.product_id
        WHERE p.cate_id = ?
        GROUP BY p.product_id
      `, [req.params.id]);
      res.json({ status: "success", count: rows.length, data: rows });
    });

    app.get("/api/user/products/categories/:id/price/:min/:max", async (req, res) => {
      const min = parseInt(req.params.min) || 0;
      const max = parseInt(req.params.max) || 999999999;
      const [rows] = await db.query(`
        SELECT p.*, MIN(v.price) AS product_price
        FROM products p
        INNER JOIN variants v ON p.product_id = v.product_id
        WHERE p.cate_id = ?
        GROUP BY p.product_id
        HAVING MIN(v.price) BETWEEN ? AND ?
      `, [req.params.id, min, max]);
      res.json({ status: "success", count: rows.length, data: rows });
    });

    app.get("/api/user/pbc/:cateId/:subCateId", async (req, res) => {
      const [rows] = await db.query(`
        SELECT p.*, MIN(v.price) AS product_price
        FROM products p
        INNER JOIN variants v ON p.product_id = v.product_id
        WHERE p.cate_id = ? AND p.sc_id = ?
        GROUP BY p.product_id
      `, [req.params.cateId, req.params.subCateId]);
      res.json({ status: "success", count: rows.length, data: rows });
    });

    app.get("/api/user/pbc/:cateId/:subCateId/price/:min/:max", async (req, res) => {
      const min = parseInt(req.params.min) || 0;
      const max = parseInt(req.params.max) || 999999999;
      const [rows] = await db.query(`
        SELECT p.*, MIN(v.price) AS product_price
        FROM products p
        INNER JOIN variants v ON p.product_id = v.product_id
        WHERE p.cate_id = ? AND p.sc_id = ?
        GROUP BY p.product_id
        HAVING MIN(v.price) BETWEEN ? AND ?
      `, [req.params.cateId, req.params.subCateId, min, max]);
      res.json({ status: "success", count: rows.length, data: rows });
    });

    app.get("/api/user/products/:id", async (req, res) => {
      const [rows] = await db.query(
        "SELECT * FROM products WHERE product_id = ?",
        [req.params.id]
      );
      if (!rows.length) {
        return res.status(404).json({ status: "error", message: "Product not found" });
      }
      res.json({ status: "success", data: rows[0] });
    });

    // ======================= OTHER =======================
    app.get("/api/user/brands", async (_, res) => {
      const [rows] = await db.query("SELECT * FROM brands");
      res.json({ status: "success", data: rows });
    });

    app.get("/api/user/blogs", async (_, res) => {
      const [rows] = await db.query(`
        SELECT blogs.*, bc.blog_cate_name
        FROM blogs
        INNER JOIN blog_categories bc
          ON blogs.blog_cate_id = bc.blog_cate_id
      `);
      res.json({ status: "success", data: rows });
    });

    app.get("/api/user/blog-categories", async (_, res) => {
      const [rows] = await db.query(`
        SELECT
            bc.blog_cate_id,
            bc.blog_cate_name,
            COUNT(b.blog_id) AS total_blogs
        FROM blog_categories bc
        LEFT JOIN blogs b
            ON bc.blog_cate_id = b.blog_cate_id
        GROUP BY
            bc.blog_cate_id,
            bc.blog_cate_name;
      `);
      res.json({ status: "success", data: rows });
    });

    app.get("/api/user/teams", async (_, res) => {
      const [rows] = await db.query("SELECT * FROM teams");
      res.json({ status: "success", data: rows });
    });

    app.get("/api/user/colors", async (_, res) => {
      const [rows] = await db.query("SELECT * FROM colors");
      res.json({ status: "success", data: rows });
    });

    app.get("/api/user/sizes", async (_, res) => {
      const [rows] = await db.query("SELECT * FROM sizes");
      res.json({ status: "success", data: rows });
    });

    app.get("/api/user/categories", async (_, res) => {
      const [rows] = await db.query("SELECT * FROM categories");
      res.json({ status: "success", data: rows });
    });

    app.get("/api/user/sub-categories/:cateId", async (req, res) => {
      const [rows] = await db.query(
        "SELECT * FROM sub_categories WHERE cate_id = ?",
        [req.params.cateId]
      );
      res.json({ status: "success", data: rows });
    });

    // ======================= START SERVER =======================
    app.listen(port, () => {
      console.log(`🚀 Server running: http://localhost:${port}`);
    });
  } catch (err) {
    console.error("❌ Server error:", err);
    process.exit(1);
  }
})();