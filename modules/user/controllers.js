const USER = require('./model');
const Lead = require('./lead'); // Create a Lead model
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = "ADMIN-TEST"; // Store in .env

// ✅ User Signup
exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: "Name, Email, and Password are required." });
        }

        // Hash Password
        req.body.password = bcrypt.hashSync(password, 10);
        const newUser = await USER.create(req.body);

        const token = jwt.sign({ id: newUser._id }, SECRET_KEY, { expiresIn: "1h" });

        res.status(201).json({
            message: "Signup successful",
            user: newUser,
            token
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ User Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required." });
        }

        const user = await USER.findOne({ email });
        if (!user) return res.status(400).json({ error: "Invalid email or password." });

        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) return res.status(400).json({ error: "Invalid email or password." });

        const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "1h" });

        // Fetch User's Leads
        const userLeads = await Lead.find({ claimBy: user.name });

        res.status(200).json({
            message: "Login successful",
            user,
            token,
            leads: userLeads
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Add Lead (After Login)
exports.addLead = async (req, res) => {
    try {
        const { createdDate, claimBy, group } = req.body;

        if (!createdDate || !claimBy || !group) {
            return res.status(400).json({ error: "Created Date, Claim By, and Group are required." });
        }

        // Verify User Token
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ error: "Unauthorized. Token required." });

        const decoded = jwt.verify(token, SECRET_KEY);
        const user = await USER.findById(decoded.id);
        if (!user) return res.status(401).json({ error: "Unauthorized user." });

        // Add Lead
        const newLead = await Lead.create({ createdDate, claimBy, group });

        res.status(201).json({
            message: "Lead added successfully",
            lead: newLead
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Get All Leads (NEW FUNCTION)
exports.getLeads = async (req, res) => {
    try {
        // Verify User Token
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ error: "Unauthorized. Token required." });

        const decoded = jwt.verify(token, SECRET_KEY);
        const user = await USER.findById(decoded.id);
        if (!user) return res.status(401).json({ error: "Unauthorized user." });

        // Fetch all leads
        const leads = await Lead.find({}, "createdDate claimBy group");

        res.status(200).json({
            message: "Leads fetched successfully",
            leads
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
