require("dotenv").config();
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

// ======================= EMAIL CONFIG =======================
const nodemailer = require("nodemailer");
let transporter;

(async () => {
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    console.log("Nodemailer: Đã khởi tạo với Gmail SMTP.");
  } else {
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      console.log("Nodemailer: Dùng Ethereal Email để test.");
    } catch (err) {
      console.error("Lỗi khi tạo test email:", err);
    }
  }
})();

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
  cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

// ======================= DOWNLOAD SOCIAL AVATAR FUNCTION =======================
const downloadSocialAvatar = async (imageUrl, prefix = 'social', identifier = 'unknown') => {
  if (!imageUrl || !imageUrl.startsWith('http')) {
    return imageUrl || 'img/fanT1.jpg';
  }

  try {
    console.log(`[DOWNLOAD AVATAR] Äang táº£i tá»«: ${imageUrl}`);
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const buffer = Buffer.from(await response.arrayBuffer());
    const ext = path.extname(new URL(imageUrl).pathname) || '.jpg';
    const filename = `${prefix}-${identifier}-${Date.now()}${ext}`;

    const savePath = path.join(
      "C:\\Users\\hlua7\\OneDrive\\Desktop\\WEB\\React\\TCGear\\public\\img",
      filename
    );

    fs.writeFileSync(savePath, buffer);
    console.log(`âœ… Avatar Ä‘Ă£ lÆ°u: img/${filename}`);
    return `img/${filename}`;
  } catch (err) {
    console.error('âŒ Download avatar tháº¥t báº¡i:', err.message);
    return 'img/fanT1.jpg';
  }
};

// ======================= FACEBOOK STRATEGY =======================
passport.use(new FacebookStrategy({
  clientID: FACEBOOK_APP_ID,
  clientSecret: FACEBOOK_APP_SECRET,
  callbackURL: 'http://localhost:3000/api/user/facebook/callback',
  profileFields: ['id', 'name', 'picture.type(large)'],
  state: true,
  passReqToCallback: true
},
  async (req, accessToken, refreshToken, profile, done) => {
    console.log('Facebook profile nháº­n Ä‘Æ°á»£c:', profile);
    try {
      const facebookId = profile.id;
      const email = `${facebookId}@facebook.placeholder.com`;
      const name = profile.name ? `${profile.name.givenName || ''} ${profile.name.familyName || ''}`.trim() || profile.displayName : 'User';
      let original_picture = profile.photos && profile.photos[0] ? profile.photos[0].value : null;
      let picture = original_picture || 'img/fanT1.jpg';

      picture = await downloadSocialAvatar(picture, 'fb', facebookId);

      let [users] = await db.query(
        'SELECT * FROM users WHERE facebook_id = ? LIMIT 1',
        [facebookId]
      );
      let user = users[0];

      if (!user) {
        const [lastUserRows] = await db.query("SELECT user_id FROM users ORDER BY CAST(SUBSTRING(user_id, 9) AS UNSIGNED) DESC LIMIT 1");
        let nextNumber = 1;
        if (lastUserRows.length > 0 && lastUserRows[0].user_id) {
          const match = lastUserRows[0].user_id.match(/TCG-USR-(\d+)/);
          if (match) nextNumber = parseInt(match[1], 10) + 1;
        }
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

        const [lastEcoRows] = await db.query("SELECT eco_info_id FROM user_eco_infos ORDER BY CAST(SUBSTRING(eco_info_id, 9) AS UNSIGNED) DESC LIMIT 1");
        let nextEcoNumber = 1;
        if (lastEcoRows.length > 0 && lastEcoRows[0].eco_info_id) {
          const match = lastEcoRows[0].eco_info_id.match(/TCG-UEC-(\d+)/);
          if (match) nextEcoNumber = parseInt(match[1], 10) + 1;
        }
        const ecoInfoId = `TCG-UEC-${String(nextEcoNumber).padStart(3, '0')}`;
        await db.query(
          `INSERT INTO user_eco_infos (eco_info_id, eco_total, eco_orders_total, user_id) VALUES (?, 0, 0, ?)`,
          [ecoInfoId, userId]
        );

        [users] = await db.query('SELECT * FROM users WHERE user_id = ?', [userId]);
        user = users[0];
      } else {
        if (picture !== "img/fanT1.jpg" && (!user.user_image || user.user_image === 'img/fanT1.jpg')) {
          await db.query('UPDATE users SET user_image = ? WHERE user_id = ?', [picture, user.user_id]);
          user.user_image = picture;
        }
      }

      user.auth_provider = 'facebook';
      user.original_avatar_url = original_picture;

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

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// PHáº¦N ASYNC DB + Táº¤T Cáº¢ ROUTE
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
let db;
const removeTone = (str) =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/Ä‘/g, "d")
    .replace(/Ä/g, "D")
    .toLowerCase();

(async () => {
  try {
    db = await connectDb();
    console.log("âœ… MySQL Connected");

    // ======================= MULTER - LÆ¯U VĂ€O FRONTEND PUBLIC/IMG =======================
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
          cb(new Error("File khĂ´ng pháº£i lĂ  hĂ¬nh áº£nh!"), false);
        }
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    });

    // ======================= AUTH MIDDLEWARE =======================
    const authenticateToken = (req, res, next) => {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];

      if (!token) {
        return res.status(401).json({ status: 'error', message: 'Token khĂ´ng há»£p lá»‡' });
      }

      jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ status: 'error', message: 'Token háº¿t háº¡n hoáº·c khĂ´ng há»£p lá»‡' });
        req.user = user;
        next();
      });
    };

    // ======================= GOOGLE LOGIN =======================
    app.post("/api/user/google-login", async (req, res) => {
      console.log("=== GOOGLE LOGIN ÄĂƒ CHáº M ===");
      const { code } = req.body;

      if (!code) {
        return res.status(400).json({ status: "error", message: "Thiáº¿u code tá»« Google" });
      }

      try {
        const { tokens } = await googleClient.getToken({
          code,
          redirect_uri: REDIRECT_URI,
        });

        if (!tokens?.access_token) {
          return res.status(400).json({
            status: "error",
            message: "KhĂ´ng láº¥y Ä‘Æ°á»£c access_token tá»« Google"
          });
        }

        console.log("Google tokens nháº­n Ä‘Æ°á»£c:", tokens);

        const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
          },
        });

        if (!userInfoResponse.ok) {
          const errorText = await userInfoResponse.text();
          console.error("Google UserInfo error:", errorText);
          throw new Error(`Google UserInfo tháº¥t báº¡i: ${userInfoResponse.status} - ${errorText}`);
        }

        const userInfo = await userInfoResponse.json();
        console.log("Google UserInfo Ä‘áº§y Ä‘á»§:", userInfo);

        const googleId = userInfo.sub;
        const email = userInfo.email;
        const name = userInfo.name || userInfo.given_name || userInfo.family_name || email.split("@")[0];

        let original_picture = userInfo.picture || null;
        let picture = "img/fanT1.jpg";
        if (userInfo.picture) {
          picture = await downloadSocialAvatar(userInfo.picture, 'google', googleId);
        }

        let [users] = await db.query(
          "SELECT * FROM users WHERE user_email = ? OR google_id = ? LIMIT 1",
          [email, googleId]
        );
        let user = users[0];

        if (!user) {
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

          const [[{ ecoCount }]] = await db.query('SELECT COUNT(*) AS ecoCount FROM user_eco_infos');
          const ecoInfoId = `TCG-UEC-${String(ecoCount + 1).padStart(3, '0')}`;
          await db.query(
            `INSERT INTO user_eco_infos (eco_info_id, eco_total, eco_orders_total, user_id) VALUES (?, 0, 0, ?)`,
            [ecoInfoId, userId]
          );

          [users] = await db.query('SELECT * FROM users WHERE user_id = ?', [userId]);
          user = users[0];
        } else {
          if (picture !== "img/fanT1.jpg" && (!user.user_image || user.user_image === 'img/fanT1.jpg')) {
            await db.query('UPDATE users SET user_image = ? WHERE user_id = ?', [picture, user.user_id]);
            user.user_image = picture;
          }
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
          token,
          user: {
            user_id: user.user_id,
            fullname: user.user_fullname,
            username: user.user_username,
            email: user.user_email,
            phone: user.user_phone_number || null,
            address: user.user_address || null,
            image: user.user_image || picture,
            isAdmin: user.user_isAdmin === 1,
            auth_provider: 'google',
            original_avatar_url: original_picture
          },
        });

      } catch (err) {
        console.error("Google login FULL error:", err);
        res.status(500).json({
          status: "error",
          message: "Lá»—i Google login: " + (err.message || "Unknown error")
        });
      }
    });

    // ======================= FACEBOOK ROUTES =======================
    app.get('/api/user/facebook-login',
      passport.authenticate('facebook', { scope: ['email'] })
    );

    app.get('/api/user/facebook/callback', (req, res, next) => {
      passport.authenticate('facebook', (err, user, info) => {
        if (err || !user) {
          return res.redirect('http://localhost:5173/login?error=facebook_failed');
        }

        req.logIn(user, (err) => {
          if (err) {
            return res.redirect('http://localhost:5173/login?error=facebook_failed');
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

          const userData = {
            user_id: user.user_id,
            fullname: user.user_fullname,
            username: user.user_username,
            email: user.user_email,
            image: user.user_image,
            isAdmin: user.user_isAdmin === 1,
            auth_provider: user.auth_provider || 'facebook',
            original_avatar_url: user.original_avatar_url || null
          };

          const redirectUrl = `http://localhost:5173/login?token=${token}&user=${encodeURIComponent(JSON.stringify(userData))}`;
          res.redirect(redirectUrl);
        });
      })(req, res, next);
    });

    // ======================= REGISTER =======================
    app.post("/api/user/register", upload.single("avatar"), async (req, res) => {
      console.log("=== REGISTER ROUTE ÄĂƒ CHáº M ===");
      console.log("Has file?", !!req.file);
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
          return res.status(400).json({ status: "error", message: "Vui lĂ²ng Ä‘iá»n Ä‘áº§y Ä‘á»§ cĂ¡c trÆ°á»ng báº¯t buá»™c" });
        }
        if (password !== confirmPassword) {
          return res.status(400).json({ status: "error", message: "Máº­t kháº©u xĂ¡c nháº­n khĂ´ng khá»›p" });
        }
        if (password.length < 8) {
          return res.status(400).json({ status: "error", message: "Máº­t kháº©u pháº£i cĂ³ Ă­t nháº¥t 8 kĂ½ tá»±" });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return res.status(400).json({ status: "error", message: "Ä á»‹a chá»‰ email khĂ´ng há»£p lá»‡" });
        }
        const cleanPhone = phone.replace(/\s/g, "");
        if (!/^0[1-9]\d{8,9}$|^\+84[1-9]\d{8,9}$/.test(cleanPhone)) {
          return res.status(400).json({ status: "error", message: "Sá»‘ Ä‘iá»‡n thoáº¡i khĂ´ng há»£p lá»‡" });
        }
        const [emailExists] = await db.query("SELECT user_id FROM users WHERE user_email = ?", [email]);
        if (emailExists.length > 0) {
          return res.status(400).json({ status: "error", message: "Email nĂ y Ä‘Ă£ Ä‘Æ°á»£c sá»­ dá»¥ng" });
        }
        const [phoneExists] = await db.query("SELECT user_id FROM users WHERE user_phone_number = ?", [cleanPhone]);
        if (phoneExists.length > 0) {
          return res.status(400).json({ status: "error", message: "Sá»‘ Ä‘iá»‡n thoáº¡i nĂ y Ä‘Ă£ Ä‘Æ°á»£c sá»­ dá»¥ng" });
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
        const [lastUserRows] = await db.query("SELECT user_id FROM users ORDER BY CAST(SUBSTRING(user_id, 9) AS UNSIGNED) DESC LIMIT 1");
        let nextNumber = 1;
        if (lastUserRows.length > 0 && lastUserRows[0].user_id) {
          const match = lastUserRows[0].user_id.match(/TCG-USR-(\d+)/);
          if (match) nextNumber = parseInt(match[1], 10) + 1;
        }
        const userId = `TCG-USR-${String(nextNumber).padStart(3, "0")}`;
        let userImage = "img/fanT1.jpg";
        if (req.file) {
          userImage = `img/${req.file.filename}`;
        }
        await db.query(
          `INSERT INTO users
          (user_id, user_fullname, user_username, user_password, user_email, user_phone_number, user_isActive, user_image, user_isAdmin, is_confirmed)
          VALUES (?, ?, ?, ?, ?, ?, 0, ?, 0, ?)`,
          [userId, fullname, username, hashedPassword, email, cleanPhone, userImage, 'Chưa xác thực']
        );

        const [lastEcoRows] = await db.query("SELECT eco_info_id FROM user_eco_infos ORDER BY CAST(SUBSTRING(eco_info_id, 9) AS UNSIGNED) DESC LIMIT 1");
        let nextEcoNumber = 1;
        if (lastEcoRows.length > 0 && lastEcoRows[0].eco_info_id) {
          const match = lastEcoRows[0].eco_info_id.match(/TCG-UEC-(\d+)/);
          if (match) nextEcoNumber = parseInt(match[1], 10) + 1;
        }
        const ecoInfoId = `TCG-UEC-${String(nextEcoNumber).padStart(3, '0')}`;
        await db.query(
          `INSERT INTO user_eco_infos (eco_info_id, eco_total, eco_orders_total, user_id) VALUES (?, 0, 0, ?)`,
          [ecoInfoId, userId]
        );
        const [newUserRows] = await db.query("SELECT * FROM users WHERE user_id = ?", [userId]);
        const newUser = newUserRows[0];

        const verifyToken = jwt.sign(
          { user_id: newUser.user_id, email: newUser.user_email },
          JWT_SECRET,
          { expiresIn: "1h" }
        );

        const verifyLink = `http://localhost:5173/verify-email?token=${verifyToken}`;

        const mailOptions = {
          from: `"TCGear" <${process.env.EMAIL_USER || "noreply@tcgear.com"}>`,
          to: newUser.user_email,
          subject: "Xác thực tài khoản TCGear",
          html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; background-color: #000; color: #fff; border: 1px solid #e11d48; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #1a1a1a; padding: 20px; text-align: center; border-bottom: 3px solid #e11d48;">
              <h1 style="color: #e11d48; margin: 0;">TCGear</h1>
            </div>
            <div style="padding: 30px;">
              <h2 style="color: #e11d48; margin-top: 0;">Chào ${newUser.user_fullname},</h2>
              <p style="color: #ddd;">Cảm ơn bạn đã đăng ký tài khoản tại TCGear. Vui lòng nhấp vào nút bên dưới để xác thực địa chỉ email của bạn.</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verifyLink}" style="background-color: #e11d48; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Xác Thực Email</a>
              </div>
              <p style="color: #888; font-size: 14px;">Liên kết này sẽ hết hạn sau 1 giờ. Nếu bạn không tạo tài khoản này, vui lòng bỏ qua email.</p>
              <hr style="border: 0; border-top: 1px solid #333; margin: 20px 0;" />
              <p style="color: #444; font-size: 12px; margin: 0;">Mã thư gửi: ${Date.now()}-${Math.random().toString(36).substring(7)}</p>
            </div>
          </div>
          <!-- Anti-trimming spacer -->
          <div style="display:none; white-space:nowrap; font:15px courier; line-height:0;">
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
          </div>`
        };

        try {
          const info = await transporter.sendMail(mailOptions);
          if (!process.env.EMAIL_USER) {
            console.log("Xem trước Email xác thực tại đây: %s", require("nodemailer").getTestMessageUrl(info));
          }
        } catch (mailErr) {
          console.error("Lỗi khi gửi email xác thực:", mailErr);
        }

        res.json({
          status: "success",
          message: "Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản.",
          require_verification: true
        });
      } catch (err) {
        console.error("Register error:", err);
        res.status(500).json({ status: "error", message: "Lá»—i server khi Ä‘Äƒng kĂ½" });
      }
    });

    // ======================= VERIFY EMAIL =======================
    app.post("/api/user/verify-email", async (req, res) => {
      try {
        const { token } = req.body;
        if (!token) {
          return res.status(400).json({ status: "error", message: "Token không hợp lệ hoặc đã hết hạn." });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        await db.query("UPDATE users SET user_isActive = 1, is_confirmed = ? WHERE user_id = ?", ['Đã xác thực', decoded.user_id]);

        res.json({ status: "success", message: "Xác nhận email thành công. Bạn đã có thể đăng nhập." });
      } catch (err) {
        console.error("Lỗi xác thực email:", err);
        res.status(400).json({ status: "error", message: "Liên kết xác thực không hợp lệ hoặc đã hết hạn." });
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

    // ======================= FORGOT & RESET PASSWORD =======================
    app.post("/api/user/forgot-password", async (req, res) => {
      try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ status: "error", message: "Vui lòng nhập email." });

        const [users] = await db.query("SELECT user_id, user_email, user_fullname FROM users WHERE user_email = ?", [email]);
        if (users.length === 0) {
          return res.json({ status: "success", message: "Nếu email tồn tại trong hệ thống, liên kết đặt lại sẽ được gửi." });
        }

        const user = users[0];
        const crypto = require("crypto");
        const token = crypto.randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        await db.query(
          "UPDATE users SET reset_password_token = ?, reset_token_expires_at = ? WHERE user_id = ?",
          [token, expiresAt, user.user_id]
        );

        const nodemailer = require("nodemailer");
        let transporter;

        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
          transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS
            }
          });
        } else {
          const testAccount = await nodemailer.createTestAccount();
          transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
              user: testAccount.user,
              pass: testAccount.pass
            }
          });
        }

        const resetLink = `http://localhost:5173/reset-password?token=${token}`;
        const mailOptions = {
          from: `"TCGear Support" <${process.env.EMAIL_USER || "support@tcgear.com"}>`,
          to: user.user_email,
          subject: "Đặt Lại Mật Khẩu - TCGear",
          html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; background-color: #000; color: #fff; border: 1px solid #e11d48; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #1a1a1a; padding: 20px; text-align: center; border-bottom: 3px solid #e11d48;">
              <h1 style="color: #e11d48; margin: 0;">TCGear</h1>
            </div>
            <div style="padding: 30px;">
              <h2 style="color: #e11d48; margin-top: 0;">Chào ${user.user_fullname},</h2>
              <p style="color: #ddd;">Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng nhấp vào nút dưới đây để thiết lập mật khẩu mới.</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetLink}" style="background-color: #e11d48; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Đặt Lại Mật Khẩu</a>
              </div>
              <p style="color: #888; font-size: 14px;">Liên kết này sẽ hết hạn sau 15 phút. Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
              <hr style="border: 0; border-top: 1px solid #333; margin: 20px 0;" />
              <p style="color: #444; font-size: 12px; margin: 0;">Mã thư gửi: ${Date.now()}-${Math.random().toString(36).substring(7)}</p>
            </div>
          </div>
          <!-- Anti-trimming spacer -->
          <div style="display:none; white-space:nowrap; font:15px courier; line-height:0;">
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
          </div>`
        };

        const info = await transporter.sendMail(mailOptions);
        if (!process.env.EMAIL_USER) {
          console.log("Xem trước Email reset tại đây: %s", nodemailer.getTestMessageUrl(info));
        }

        res.json({ status: "success", message: "Liên kết đặt lại mật khẩu đã được gửi đến email của bạn." });
      } catch (err) {
        console.error("Lỗi POST /api/user/forgot-password:", err);
        res.status(500).json({ status: "error", message: "Lỗi server." });
      }
    });

    app.post("/api/user/reset-password", async (req, res) => {
      try {
        const { token, password } = req.body;
        if (!token || !password) return res.status(400).json({ status: "error", message: "Thiếu thông tin." });

        const [users] = await db.query(
          "SELECT user_id FROM users WHERE reset_password_token = ? AND reset_token_expires_at > NOW()",
          [token]
        );

        if (users.length === 0) {
          return res.status(400).json({ status: "error", message: "Liên kết không hợp lệ hoặc đã hết hạn." });
        }

        const user = users[0];
        const hash = await bcrypt.hash(password, 10);

        await db.query(
          "UPDATE users SET user_password = ?, reset_password_token = NULL, reset_token_expires_at = NULL WHERE user_id = ?",
          [hash, user.user_id]
        );

        res.json({ status: "success", message: "Mật khẩu đã được đặt lại thành công." });
      } catch (err) {
        console.error("Lỗi POST /api/user/reset-password:", err);
        res.status(500).json({ status: "error", message: "Lỗi server." });
      }
    });

    // ======================= LOGIN =======================
    app.post("/api/user/login", async (req, res) => {
      try {
        const { identifier, password } = req.body;
        if (!identifier || !password) {
          return res.status(400).json({ status: "error", message: "Vui lĂ²ng cung cáº¥p username/email vĂ  máº­t kháº©u" });
        }
        const [rows] = await db.query(
          `SELECT * FROM users
          WHERE user_username = ? OR user_email = ?
          LIMIT 1`,
          [identifier, identifier]
        );
        if (rows.length === 0) {
          return res.status(401).json({ status: "error", message: "TĂ i khoáº£n hoáº·c máº­t kháº©u khĂ´ng Ä‘Ăºng" });
        }
        const user = rows[0];
        if (user.user_isActive !== 1) {
          return res.status(403).json({ status: "error", message: "TĂ i khoáº£n cá»§a báº¡n Ä‘Ă£ bá»‹ khĂ³a" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.user_password);
        if (!isPasswordValid) {
          return res.status(401).json({ status: "error", message: "TĂ i khoáº£n hoáº·c máº­t kháº©u khĂ´ng Ä‘Ăºng" });
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
          message: "ÄÄƒng nháº­p thĂ nh cĂ´ng",
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
        res.status(500).json({ status: "error", message: "Lá»—i server" });
      }
    });

    // ======================= GET DEFAULT ADDRESS BY USER ID =======================
    app.get("/api/user/addresses/default/:userId", async (req, res) => {
      try {
        const { userId } = req.params;

        // Kiá»ƒm tra user cĂ³ tá»“n táº¡i khĂ´ng
        const [userCheck] = await db.query(
          'SELECT user_id FROM users WHERE user_id = ?',
          [userId]
        );

        if (userCheck.length === 0) {
          return res.status(404).json({
            status: 'error',
            message: 'KhĂ´ng tĂ¬m tháº¥y ngÆ°á»i dĂ¹ng'
          });
        }

        const [addresses] = await db.query(
          `SELECT 
        address_id,
        user_id,
        address,
        recipient_name,
        phone_number,
        is_default,
        created_at,
        updated_at
      FROM user_addresses 
      WHERE user_id = ? AND is_default = 1
      LIMIT 1`,
          [userId]
        );

        if (addresses.length === 0) {
          return res.json({
            status: 'success',
            data: null,
            message: 'ChÆ°a cĂ³ Ä‘á»‹a chá»‰ máº·c Ä‘á»‹nh'
          });
        }

        res.json({
          status: 'success',
          data: addresses[0]
        });
      } catch (err) {
        console.error('Lá»—i láº¥y Ä‘á»‹a chá»‰ máº·c Ä‘á»‹nh:', err);
        res.status(500).json({
          status: 'error',
          message: 'Lá»—i server khi láº¥y Ä‘á»‹a chá»‰ máº·c Ä‘á»‹nh'
        });
      }
    });

    // ======================= PROFILE API - FULL =======================
    app.get('/api/user/profile', authenticateToken, async (req, res) => {
      try {
        const userId = req.user.user_id;
        const [profileRows] = await db.query(
          `SELECT
            u.user_id, u.user_fullname, u.user_email, u.user_phone_number,
            u.user_image, u.created_at,
            ua.address_id, ua.address, ua.recipient_name, ua.phone_number,
            ua.is_default, ua.created_at AS address_created_at
          FROM users u
          LEFT JOIN user_addresses ua ON u.user_id = ua.user_id
          WHERE u.user_id = ?
          ORDER BY ua.is_default DESC, ua.created_at DESC`,
          [userId]
        );

        if (profileRows.length === 0) {
          return res.status(404).json({ status: 'error', message: 'KhĂ´ng tĂ¬m tháº¥y ngÆ°á»i dĂ¹ng' });
        }

        const userInfo = profileRows[0];
        const addresses = profileRows
          .filter(row => row.address_id !== null)
          .map(row => ({
            id: row.address_id,
            address: row.address,
            recipient_name: row.recipient_name || '',
            phone_number: row.phone_number || '',
            is_default: Boolean(row.is_default),
            created_at: row.address_created_at
          }));

        const [ecoRows] = await db.query(
          `SELECT eco_orders_total, eco_total FROM user_eco_infos WHERE user_id = ?`,
          [userId]
        );

        const [activityRows] = await db.query(
          `SELECT 
             ua.type, 
             ua.ref_id, 
             CASE 
               WHEN ua.type = 'ORDER' THEN CONCAT('Báº¡n Ä‘Ă£ Ä‘áº·t Ä‘Æ¡n hĂ ng thĂ nh cĂ´ng: MĂ£ Ä‘Æ¡n hĂ ng ', ua.ref_id)
               WHEN ua.type = 'COMMENT' THEN CONCAT('Báº¡n Ä‘Ă£ bĂ¬nh luáº­n á»Ÿ sáº£n pháº©m: ', IFNULL(p.product_name, 'Sáº£n pháº©m'))
               ELSE ua.description 
             END AS description,
             ua.created_at AS time 
           FROM user_activities ua
           LEFT JOIN comments c ON ua.type = 'COMMENT' AND ua.ref_id = c.cmt_id
           LEFT JOIN products p ON c.product_id = p.product_id
           WHERE ua.user_id = ?
           ORDER BY ua.created_at DESC LIMIT 10`,
          [userId]
        );

        res.json({
          status: 'success',
          user: {
            user_id: userInfo.user_id,
            user_fullname: userInfo.user_fullname,
            user_email: userInfo.user_email,
            user_phone_number: userInfo.user_phone_number,
            user_image: userInfo.user_image || 'img/fanT1.jpg',
            created_at: userInfo.created_at
          },
          eco: ecoRows[0] || { eco_orders_total: 0, eco_total: 0 },
          addresses,
          activities: activityRows
        });
      } catch (err) {
        console.error('Lá»—i GET profile:', err);
        res.status(500).json({ status: 'error', message: 'Lá»—i server' });
      }
    });

    // ======================= UPDATE AVATAR =======================
    app.put('/api/user/avatar', authenticateToken, upload.single('avatar'), async (req, res) => {
      try {
        if (!req.file) return res.status(400).json({ status: 'error', message: 'KhĂ´ng cĂ³ file áº£nh' });

        const userId = req.user.user_id;
        const newImagePath = `img/${req.file.filename}`;

        await db.query('UPDATE users SET user_image = ? WHERE user_id = ?', [newImagePath, userId]);
        await db.query(
          `INSERT INTO user_activities (user_id, type, description) VALUES (?, 'UPDATE_AVATAR', 'Báº¡n Ä‘Ă£ cáº­p nháº­t áº£nh Ä‘áº¡i diá»‡n')`,
          [userId]
        );

        res.json({ status: 'success', message: 'Cáº­p nháº­t áº£nh thĂ nh cĂ´ng', image: newImagePath });
      } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Lá»—i server' });
      }
    });

    // ======================= UPDATE PROFILE INFO =======================
    app.put('/api/user/profile', authenticateToken, async (req, res) => {
      try {
        const userId = req.user.user_id;
        const { fullname, email, phone } = req.body;

        const [rows] = await db.query('SELECT * FROM users WHERE user_id = ?', [userId]);
        const oldUser = rows[0];

        await db.query(
          `UPDATE users SET user_fullname = ?, user_email = ?, user_phone_number = ? WHERE user_id = ?`,
          [fullname, email, phone || null, userId]
        );

        let changes = [];
        if (oldUser.user_fullname !== fullname) changes.push(`tĂªn thĂ nh "${fullname}"`);
        if (oldUser.user_email !== email) changes.push(`email thĂ nh "${email}"`);
        if ((oldUser.user_phone_number || '') !== (phone || '')) changes.push(`sá»‘ Ä‘iá»‡n thoáº¡i thĂ nh "${phone}"`);

        let description = 'Báº¡n Ä‘Ă£ cáº­p nháº­t thĂ´ng tin cĂ¡ nhĂ¢n';
        if (changes.length > 0) {
          description = `Báº¡n vá»«a cáº­p nháº­t ${changes.join(' vĂ  ')}`;
        }

        await db.query(
          `INSERT INTO user_activities (user_id, type, description) VALUES (?, 'UPDATE_PROFILE', ?)`,
          [userId, description]
        );

        res.json({ status: 'success', message: 'Cáº­p nháº­t thĂ´ng tin thĂ nh cĂ´ng' });
      } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Lá»—i server' });
      }
    });

    // ======================= ADDRESSES API =======================
    app.post('/api/user/addresses', authenticateToken, async (req, res) => {
      try {
        const userId = req.user.user_id;
        const { address, recipient_name, phone_number } = req.body;

        if (!address?.trim()) {
          return res.status(400).json({ status: 'error', message: 'Äá»‹a chá»‰ khĂ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng' });
        }

        if (!recipient_name?.trim()) {
          return res.status(400).json({ status: 'error', message: 'Vui lĂ²ng nháº­p tĂªn ngÆ°á»i nháº­n' });
        }

        const addressId = `ADDR-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        const [existingDefault] = await db.query(
          'SELECT address_id FROM user_addresses WHERE user_id = ? AND is_default = 1 LIMIT 1',
          [userId]
        );

        const isDefault = existingDefault.length === 0 ? 1 : 0;

        await db.query(
          `INSERT INTO user_addresses 
           (address_id, user_id, address, recipient_name, phone_number, is_default, created_at)
           VALUES (?, ?, ?, ?, ?, ?, NOW())`,
          [addressId, userId, address.trim(), recipient_name.trim(), phone_number?.trim() || null, isDefault]
        );
        await db.query(
          `INSERT INTO user_activities (user_id, type, ref_id, description) VALUES (?, 'ADDRESS', ?, ?)`,
          [userId, addressId, `Báº¡n Ä‘Ă£ thĂªm Ä‘á»‹a chá»‰ má»›i`]
        );

        res.json({
          status: 'success',
          message: 'ThĂªm Ä‘á»‹a chá»‰ thĂ nh cĂ´ng',
          address: {
            id: addressId,
            address: address.trim(),
            recipient_name: recipient_name.trim(),
            phone_number: phone_number?.trim() || null,
            is_default: !!isDefault,
            created_at: new Date().toISOString()
          }
        });
      } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Lá»—i server khi thĂªm Ä‘á»‹a chá»‰' });
      }
    });

    app.put('/api/user/addresses/:id/default', authenticateToken, async (req, res) => {
      try {
        const userId = req.user.user_id;
        const { id } = req.params;

        await db.query('UPDATE user_addresses SET is_default = FALSE WHERE user_id = ?', [userId]);
        await db.query('UPDATE user_addresses SET is_default = TRUE WHERE address_id = ? AND user_id = ?', [id, userId]);

        res.json({ status: 'success', message: 'Äáº·t máº·c Ä‘á»‹nh thĂ nh cĂ´ng' });
      } catch (err) {
        res.status(500).json({ status: 'error', message: 'Lá»—i server' });
      }
    });

    app.delete('/api/user/addresses/:id', authenticateToken, async (req, res) => {
      try {
        const userId = req.user.user_id;
        const { id } = req.params;

        await db.query('DELETE FROM user_addresses WHERE address_id = ? AND user_id = ?', [id, userId]);
        res.json({ status: 'success', message: 'XĂ³a thĂ nh cĂ´ng' });
      } catch (err) {
        res.status(500).json({ status: 'error', message: 'Lá»—i server' });
      }
    });

    // ======================= TEST GOOGLE =======================
    app.post("/api/user/test-google", (req, res) => {
      console.log("ÄĂ£ cháº¡m route test-google", req.body);
      res.json({ status: "ok", message: "Route test OK" });
    });

    // ======================= GET RESPONSES BY PRODUCT ID =======================
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

    // ======================= GET COMMENTS BY PRODUCT ID =======================
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

    // ======================= API POST RESPONSES =======================
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

    // ======================= API POST COMMENTS =========================
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
        if (userId) {
          await db.query(
            `INSERT INTO user_activities (user_id, type, ref_id, description) VALUES (?, 'COMMENT', ?, ?)`,
            [userId, cmtId, `Báº¡n Ä‘Ă£ Ä‘Ă¡nh giĂ¡ sáº£n pháº©m`]
          );
        }
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

    app.get("/api/user/vouchers", async (req, res) => {
      try {
        const [rows] = await db.query("SELECT * FROM vouchers ORDER BY create_at DESC");

        if (rows.length === 0) {
          return res.json({ status: "success", data: [], message: "KhĂ´ng cĂ³ voucher nĂ o" });
        }

        res.json({ status: "success", data: rows });
      } catch (err) {
        console.error("Lá»—i GET vouchers:", err);
        res.status(500).json({ status: "error", message: "Lá»—i server khi láº¥y dá»¯ liá»‡u vouchers" });
      }
    });

    // ======================= ORDERS API =======================
    app.post("/api/orders", async (req, res) => {
      const { user_id, payment_method, shipping_method, note, total_amount, shipping_address, recipient_name, recipient_phone, recipient_email, items, order_date: clientDate, order_time: clientTime, applied_vouchers } = req.body;

      if (!user_id || !items || !items.length) {
        return res.status(400).json({ status: "error", message: "Dá»¯ liá»‡u khĂ´ng há»£p lá»‡" });
      }

      try {
        await db.beginTransaction();

        // 1. Táº¡o order_id
        const [[{ count }]] = await db.query('SELECT COUNT(*) AS count FROM orders');
        const nextOrderNum = count + 1;
        const order_id = `TCG-ORD-${String(nextOrderNum).padStart(3, '0')}`;

        const now = new Date();
        const localDateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        const order_date = clientDate || localDateStr;
        const order_time = clientTime || now.toTimeString().split(' ')[0];

        // 2. Insert order
        await db.query(
          `INSERT INTO orders (
            order_id, user_id, order_date, order_time, order_status, 
            payment_status, payment_method, shipping_method, recipient_name, 
            recipient_phone, recipient_email, shipping_address, shipping_status, note, applied_vouchers
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            order_id, user_id, order_date, order_time, 'Chờ xác nhận',
            'Chờ thanh toán', payment_method || 'Thanh Toán Khi Nhận Hàng', shipping_method || 'Giao Hàng Tiêu Chuẩn',
            recipient_name || '', recipient_phone || '', recipient_email || '',
            shipping_address, 'Chờ xử lý', note || '',
            (applied_vouchers && applied_vouchers.length > 0) ? applied_vouchers.join(',') : null
          ]
        );

        // 3. Insert order details
        const [[{ count: detailCount }]] = await db.query('SELECT COUNT(*) AS count FROM order_details');
        let nextDetailNum = detailCount + 1;

        for (const item of items) {
          const detail_id = `TCG-ODT-${String(nextDetailNum++).padStart(3, '0')}`;
          const item_total = item.quantity * item.price;
          await db.query(
            `INSERT INTO order_details (detail_id, order_id, variant_id, quantity, total_amount) 
             VALUES (?, ?, ?, ?, ?)`,
            [detail_id, order_id, item.variant_id, item.quantity, item_total]
          );
        }

        await db.query(
          `INSERT INTO user_activities (user_id, type, ref_id, description) VALUES (?, 'ORDER', ?, ?)`,
          [user_id, order_id, `Báº¡n Ä‘Ă£ Ä‘áº·t Ä‘Æ¡n hĂ ng thĂ nh cĂ´ng`]
        );

        // 4. Update voucher usage time
        if (applied_vouchers && Array.isArray(applied_vouchers)) {
          for (const code of applied_vouchers) {
            if (code) {
              await db.query(
                `UPDATE vouchers SET voucher_usage_time = voucher_usage_time - 1 WHERE voucher_code = ? AND voucher_usage_time > 0`,
                [code]
              );
            }
          }
        }

        await db.commit();

        // 5. Gửi email xác nhận đơn hàng
        if (recipient_email) {
          const confirmLink = `http://localhost:5173/order-confirm?orderId=${order_id}`;
          const mailOptions = {
            from: `"TCGear Orders" <${process.env.EMAIL_USER || "orders@tcgear.com"}>`,
            to: recipient_email,
            subject: `Xác Nhận Đơn Hàng ${order_id} - TCGear`,
            html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; background-color: #000; color: #fff; border: 1px solid #e11d48; border-radius: 8px; overflow: hidden;">
              <div style="background-color: #1a1a1a; padding: 20px; text-align: center; border-bottom: 3px solid #e11d48;">
                <h1 style="color: #e11d48; margin: 0;">TCGear</h1>
              </div>
              <div style="padding: 30px;">
                <h2 style="color: #e11d48; margin-top: 0;">Cảm ơn bạn đã đặt hàng, ${recipient_name}!</h2>
                <p style="color: #ddd;">Đơn hàng <strong>${order_id}</strong> của bạn đã được ghi nhận. Vui lòng nhấn vào nút bên dưới để xác nhận đơn hàng và để chúng tôi bắt đầu quá trình xử lý.</p>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${confirmLink}" style="background-color: #e11d48; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Xác Nhận Đơn Hàng</a>
                </div>
                <hr style="border: 0; border-top: 1px solid #333; margin: 20px 0;" />
                <p style="color: #444; font-size: 12px; margin: 0;">Mã thư gửi: ${Date.now()}-${Math.random().toString(36).substring(7)}</p>
              </div>
            </div>
            <!-- Anti-trimming spacer -->
            <div style="display:none; white-space:nowrap; font:15px courier; line-height:0;">
              &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 
              &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 
              &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            </div>`
          };

          try {
            const nodemailer = require("nodemailer");
            const info = await transporter.sendMail(mailOptions);
            if (!process.env.EMAIL_USER) {
              console.log("Xem trước Email xác nhận đơn hàng tại đây: %s", nodemailer.getTestMessageUrl(info));
            }
          } catch (emailErr) {
            console.error("Lỗi gửi email xác nhận đơn hàng:", emailErr);
          }
        }

        res.json({ status: "success", message: "Ä áº·t hĂ ng thĂ nh cĂ´ng", data: { order_id } });
      } catch (err) {
        await db.rollback();
        console.error("Lá»—i POST /api/orders:", err);
        res.status(500).json({ status: "error", message: "Lá»—i táº¡o Ä‘Æ¡n hĂ ng" });
      }
    });

    app.put("/api/orders/:orderId/confirm-email", async (req, res) => {
      try {
        const { orderId } = req.params;

        const [orders] = await db.query('SELECT order_status FROM orders WHERE order_id = ?', [orderId]);
        if (orders.length === 0) {
          return res.status(404).json({ status: "error", message: "Đơn hàng không tồn tại." });
        }

        const currentStatus = orders[0].order_status;
        if (currentStatus === 'Chờ xử lý') {
          // Nếu đã được xác nhận (bởi request trước đó do StrictMode), vẫn trả về success
          return res.json({ status: "success", message: "Đơn hàng đã được xác nhận từ trước." });
        }

        if (currentStatus !== 'Chờ xác nhận') {
          return res.status(400).json({ status: "error", message: "Trạng thái đơn hàng không hợp lệ để xác nhận." });
        }

        await db.query(
          `UPDATE orders SET order_status = 'Chờ xử lý' WHERE order_id = ?`,
          [orderId]
        );

        res.json({ status: "success", message: "Xác nhận đơn hàng thành công" });
      } catch (err) {
        console.error("Lỗi xác nhận đơn hàng:", err);
        res.status(500).json({ status: "error", message: "Lỗi server" });
      }
    });

    app.put("/api/orders/:orderId/receive", async (req, res) => {
      try {
        const { orderId } = req.params;

        // Bắt đầu Transaction để đảm bảo an toàn dữ liệu (nếu trừ kho lỗi thì sẽ hoàn tác việc cập nhật trạng thái)
        await db.beginTransaction();

        // 1. Cập nhật trạng thái nhận hàng
        const [result] = await db.query(
          `UPDATE orders SET is_received = 'Đã nhận hàng' WHERE order_id = ?`,
          [orderId]
        );

        if (result.affectedRows === 0) {
          await db.rollback(); // Hoàn tác nếu không tìm thấy đơn
          return res.status(404).json({ status: "error", message: "Không tìm thấy đơn hàng" });
        }

        // 2. Lấy danh sách sản phẩm và số lượng mà khách đã mua trong đơn hàng này
        const [orderDetails] = await db.query(
          `SELECT variant_id, quantity FROM order_details WHERE order_id = ?`,
          [orderId]
        );

        // 3. Tiến hành trừ số lượng trong bảng variants
        for (const item of orderDetails) {
          // LƯU Ý QUAN TRỌNG: Hãy thay chữ 'stock' dưới đây bằng tên cột lưu số lượng tồn kho 
          // thực tế trong bảng variants của bạn (có thể là 'quantity', 'stock', v.v.)
          await db.query(
            `UPDATE variants SET stock = stock - ? WHERE variant_id = ?`,
            [item.quantity, item.variant_id]
          );
        }

        // Xác nhận lưu các thay đổi vào Database
        await db.commit();
        res.json({ status: "success", message: "Đã xác nhận nhận hàng và trừ số lượng trong kho" });

      } catch (err) {
        await db.rollback(); // Nếu có bất kỳ lỗi nào (kể cả lỗi SQL), quay ngược lại trạng thái ban đầu
        console.error("Lỗi PUT /api/orders/:orderId/receive:", err);
        res.status(500).json({ status: "error", message: "Lỗi server khi cập nhật trạng thái nhận hàng" });
      }
    });


    // ======================= API HOÀN TRẢ ĐƠN HÀNG (MỘT PHẦN / TOÀN BỘ) =======================
    app.post("/api/orders/:orderId/return", async (req, res) => {
      try {
        const { orderId } = req.params;
        const { returnItems } = req.body; // Mảng: [{ variant_id, return_quantity }]

        if (!returnItems || returnItems.length === 0) {
          return res.status(400).json({ status: "error", message: "Vui lòng chọn sản phẩm" });
        }

        await db.beginTransaction();

        const [orders] = await db.query(`SELECT * FROM orders WHERE order_id = ?`, [orderId]);
        if (orders.length === 0) {
          await db.rollback();
          return res.status(404).json({ status: "error", message: "Không tìm thấy đơn hàng" });
        }

        const order = orders[0];
        if (order.order_status === 'Hoàn trả') {
          await db.rollback();
          return res.status(400).json({ status: "error", message: "Đơn hàng đã hoàn trả" });
        }

        const [orderDetails] = await db.query(`SELECT * FROM order_details WHERE order_id = ?`, [orderId]);

        for (const returnItem of returnItems) {
          const detail = orderDetails.find(d => d.variant_id === returnItem.variant_id);

          if (detail) {
            const returnQty = parseInt(returnItem.return_quantity, 10);

            if (returnQty > 0 && returnQty <= detail.quantity) {
              const unitPrice = detail.total_amount / detail.quantity;
              const refundAmount = unitPrice * returnQty;

              // 1. Cộng lại kho
              await db.query(`UPDATE variants SET stock = stock + ? WHERE variant_id = ?`, [returnQty, detail.variant_id]);

              // 2. Trừ quantity và total_amount trong đơn hàng
              await db.query(`UPDATE order_details SET quantity = quantity - ?, total_amount = total_amount - ? WHERE detail_id = ?`,
                [returnQty, refundAmount, detail.detail_id]);
            }
          }
        }

        // 3. Kiểm tra xem còn sản phẩm nào không
        const [updatedDetails] = await db.query(`SELECT SUM(quantity) as totalQty FROM order_details WHERE order_id = ?`, [orderId]);
        if (updatedDetails[0].totalQty <= 0) {
          await db.query(`UPDATE orders SET order_status = 'Hoàn trả', shipping_status = 'Hoàn trả', is_received = 'Đã hoàn trả' WHERE order_id = ?`, [orderId]);
        }

        // 4. Đồng bộ Eco Info
        const sqlSync = `
      UPDATE user_eco_infos
      SET 
        eco_orders_total = (SELECT COUNT(DISTINCT o.order_id) FROM orders o WHERE o.user_id = ? AND o.order_status IN ('Đã giao', 'Hoàn thành', 'Ä Ă£ giao')),
        eco_total = (SELECT COALESCE(SUM(od.total_amount), 0) FROM orders o JOIN order_details od ON o.order_id = od.order_id WHERE o.user_id = ? AND o.order_status IN ('Đã giao', 'Hoàn thành', 'Ä Ă£ giao'))
      WHERE user_id = ?;
    `;
        await db.query(sqlSync, [order.user_id, order.user_id, order.user_id]);

        await db.commit();
        res.json({ status: "success", message: "Hoàn trả thành công" });
      } catch (err) {
        await db.rollback();
        res.status(500).json({ status: "error", message: "Lỗi server" });
      }
    });

    app.get("/api/orders/user/:userId", async (req, res) => {
      try {
        const { userId } = req.params;
        const [orders] = await db.query(
          `SELECT * FROM orders WHERE user_id = ? ORDER BY order_date DESC, order_time DESC`,
          [userId]
        );

        for (let order of orders) {
          const [products] = await db.query(
            `SELECT 
               od.quantity, od.total_amount,
               p.product_name as name, p.product_image as image,
               COALESCE(v.variant_id, p.product_id) as sku,
               s.size_name as size,
               c.color_name as color
             FROM order_details od
             LEFT JOIN variants v ON od.variant_id = v.variant_id
             JOIN products p ON (v.product_id = p.product_id OR od.variant_id = p.product_id)
             LEFT JOIN sizes s ON v.size_id = s.size_id
             LEFT JOIN colors c ON v.color_id = c.color_id
             WHERE od.order_id = ?`,
            [order.order_id]
          );

          order.products = products.map(p => ({
            name: p.name,
            quantity: p.quantity,
            price: p.total_amount,
            sku: p.sku,
            image: p.image,
            variant: (p.size && p.color) ? `${p.color}/${p.size}` : (p.size || p.color || '')
          }));
        }

        res.json({ status: "success", data: orders });
      } catch (err) {
        console.error("Lá»—i GET /api/orders/user/:userId:", err);
        res.status(500).json({ status: "error", message: "Lá»—i láº¥y danh sĂ¡ch Ä‘Æ¡n hĂ ng" });
      }
    });

    // API Äá»“ng bá»™ VĂ­ Eco (Gá»i Ä‘á»ƒ tá»± Ä‘á»™ng tĂ­nh toĂ¡n láº¡i tá»« DB)
    app.get("/api/user/:userId/sync-eco", async (req, res) => {
      try {
        const { userId } = req.params;
        await syncUserEcoInfo(userId);
        res.json({ status: "success", message: "Äá»“ng bá»™ Eco Info thĂ nh cĂ´ng" });
      } catch (err) {
        console.error("Lá»—i GET /api/user/:userId/sync-eco:", err);
        res.status(500).json({ status: "error", message: "Lá»—i Ä‘á»“ng bá»™ Eco Info" });
      }
    });

    async function syncUserEcoInfo(userId) {
      try {
        const sql = `
          UPDATE user_eco_infos
          SET 
            eco_orders_total = (
              SELECT COUNT(DISTINCT o.order_id)
              FROM orders o
              WHERE o.user_id = ?
                AND o.payment_status IN ('Đã thanh toán', 'Ä Ă£ thanh toĂ¡n')
                AND o.order_status IN ('Đã giao', 'Ä Ă£ giao', 'Hoàn thành')
                AND o.shipping_status IN ('Đã giao', 'Ä Ă£ giao')
                AND o.is_received = 'Đã nhận hàng'
            ),
            eco_total = (
              SELECT COALESCE(SUM(od.total_amount), 0)
              FROM orders o
              JOIN order_details od ON o.order_id = od.order_id
              WHERE o.user_id = ?
                AND o.payment_status IN ('Đã thanh toán', 'Ä Ă£ thanh toĂ¡n')
                AND o.order_status IN ('Đã giao', 'Ä Ă£ giao', 'Hoàn thành')
                AND o.shipping_status IN ('Đã giao', 'Ä Ă£ giao')
                AND o.is_received = 'Đã nhận hàng'
            )
          WHERE user_id = ?;
        `;

        await db.query(sql, [userId, userId, userId]);
      } catch (error) {
        console.error("Lỗi khi đồng bộ user_eco_infos:", error);
      }
    }

    // ======================= SYNC ECO INFO API =======================
    app.post("/api/user/:userId/sync-eco", async (req, res) => {
      try {
        await syncUserEcoInfo(req.params.userId);
        res.json({ status: "success", message: "Đã đồng bộ điểm Eco thành công" });
      } catch (err) {
        console.error("Lỗi khi gọi API sync-eco:", err);
        res.status(500).json({ status: "error", message: "Lỗi server" });
      }
    });

    app.post("/api/messages", async (req, res) => {
      try {
        const { guest_name, guest_email, message_title, message_text, user_id } = req.body;
        if (!guest_name || !guest_email || !message_text) {
          return res.status(400).json({ status: "error", message: "Vui lòng nhập đủ thông tin." });
        }

        const [rows] = await db.query("SELECT message_id FROM messages ORDER BY message_id DESC LIMIT 1");
        let nextIdNum = 1;
        if (rows.length > 0 && rows[0].message_id) {
          const lastId = rows[0].message_id;
          const match = lastId.match(/\d+$/);
          if (match) {
            nextIdNum = parseInt(match[0]) + 1;
          }
        }
        const messageId = "TCG-MSG-" + nextIdNum.toString().padStart(3, "0");

        const query = "INSERT INTO messages (message_id, user_id, guest_name, message_text, guest_email, message_title) VALUES (?, ?, ?, ?, ?, ?)";
        await db.query(query, [messageId, user_id || null, guest_name, message_text, guest_email, message_title || null]);

        try {
          const nodemailer = require("nodemailer");
          let transporter;

          if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            transporter = nodemailer.createTransport({
              service: "gmail",
              auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
              }
            });
          } else {
            // Dùng ethereal email để test nếu không có credentials thực tế
            const testAccount = await nodemailer.createTestAccount();
            transporter = nodemailer.createTransport({
              host: "smtp.ethereal.email",
              port: 587,
              secure: false,
              auth: {
                user: testAccount.user,
                pass: testAccount.pass
              }
            });
            console.log("Đã tạo test account SMTP Ethereal để gửi email xác nhận.");
          }

          const mailOptions = {
            from: `"TCGear Support" <${process.env.EMAIL_USER || "support@tcgear.com"}>`,
            to: guest_email,
            subject: "Xác nhận gửi tin nhắn liên hệ thành công - TCGear",
            attachments: [{
              filename: "logo_mail.jpg",
              path: path.join(__dirname, "public", "img", "logo_mail.jpg"),
              cid: "tcgear-logo"
            }],
            html: `<!DOCTYPE html>
              <html lang="vi">
              <head>
                <meta charset="UTF-8">
              </head>
              <body style="margin: 0; padding: 0; background-color: #f4f4f4;">
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; background-color: #000; color: #fff; border: 1px solid #e11d48; border-radius: 8px; overflow: hidden;">
                  <div style="background-color: #1a1a1a; padding: 20px; text-align: center; border-bottom: 3px solid #e11d48;">
                    <img src="cid:tcgear-logo" alt="TCGear Logo" style="max-height: 80px; width: auto; max-width: 100%; display: inline-block; vertical-align: middle;" />
                  </div>
                  <div style="padding: 30px;">
                    <h2 style="color: #e11d48; margin-top: 0;">Xin chào ${guest_name},</h2>
                    <p style="color: #ddd;">Chúng tôi đã nhận được tin nhắn của bạn với chủ đề: <strong style="color: #fff;">"${message_title}"</strong>.</p>
                    <div style="background-color: #222; padding: 15px; border-left: 4px solid #e11d48; margin: 20px 0; border-radius: 4px;">
                      <p style="margin: 0; color: #eee; font-style: italic;">"${message_text}"</p>
                    </div>
                    <p style="color: #ddd;">Đội ngũ chuyên gia của TCGear đang xem xét yêu cầu của bạn và sẽ phản hồi lại qua email này trong thời gian sớm nhất (thường trong vòng 24h).</p>
                    <p style="color: #ddd; margin-top: 30px;">Trân trọng,<br/><strong style="color: #e11d48;">Đội ngũ TCGear</strong></p>
                  </div>
                  <div style="background-color: #1a1a1a; text-align: center; padding: 15px; font-size: 12px; color: #888; border-top: 1px solid #333;">
                    © 2026 TCGear. All rights reserved.<br/>
                    Trụ sở chính T1: 627 Seolleung-ro, Gangnam-gu, Seoul, Hàn Quốc
                  </div>
                </div>
              </body>
              </html>
            `
          };

          const info = await transporter.sendMail(mailOptions);
          if (!process.env.EMAIL_USER) {
            console.log("Xem trước Email xác nhận tại đây: %s", nodemailer.getTestMessageUrl(info));
          }
        } catch (emailErr) {
          console.error("Lỗi gửi email xác nhận:", emailErr);
        }

        res.json({ status: "success", message: "Gửi tin nhắn thành công!" });
      } catch (err) {
        console.error("Lỗi POST /api/messages:", err);
        res.status(500).json({ status: "error", message: "Lỗi server khi gửi tin nhắn" });
      }
    });

    // ======================= START SERVER =======================
    app.listen(port, () => {
      console.log(` Server running: http://localhost:${port}`);
    });
  } catch (err) {
    console.error(" Server error:", err);
    process.exit(1);
  }
})();






