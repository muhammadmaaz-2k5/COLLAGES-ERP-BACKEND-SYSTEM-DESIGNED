const { z } = require("zod");
const AuthService = require("../services/authService");

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  roleCode: z.string().optional(),
  studentId: z.string().optional(),
  employeeId: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

class AuthController {
  static async register(req, res, next) {
    try {
      const validated = registerSchema.parse(req.body);
      const result = await AuthService.register({ ...validated, req });

      return res.status(201).json({
        success: true,
        data: result,
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: { code: "VALIDATION_ERROR", message: err.errors[0].message, details: err.errors },
        });
      }
      next(err);
    }
  }

  static async login(req, res, next) {
    try {
      const validated = loginSchema.parse(req.body);
      const result = await AuthService.login({ ...validated, req });

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: { code: "VALIDATION_ERROR", message: err.errors[0].message },
        });
      }
      return res.status(401).json({
        success: false,
        error: { code: "AUTH_FAILED", message: err.message },
      });
    }
  }

  static async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          error: { code: "MISSING_REFRESH_TOKEN", message: "Refresh token is required" },
        });
      }

      const result = await AuthService.refreshToken({ token: refreshToken });
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      return res.status(401).json({
        success: false,
        error: { code: "REFRESH_FAILED", message: err.message },
      });
    }
  }

  static async getMe(req, res) {
    return res.status(200).json({
      success: true,
      data: {
        user: req.user,
      },
    });
  }
}

module.exports = AuthController;
