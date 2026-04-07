const generateEmailTemplate = (verificationCode) => {
  const otpArray = verificationCode.split("");

  return `
  <div style="font-family: 'Inter', Arial, sans-serif; background:#0f0623; padding:30px 0;">
    
    <div style="max-width:600px;margin:auto;background:#1a0a2e;border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,0.08);">
      
      <!-- IMAGE BANNER -->
      <img src="https://live.worldtourismforum.net/uploads/Global-Travel-and-Tourism-Set-for-Record-Breaking-2025.jpg"
           style="width:100%;height:200px;object-fit:cover;" />

      <!-- CONTENT -->
      <div style="padding:30px;text-align:center;color:#f8f4ff;">
        
        <h2 style="margin-bottom:10px;font-size:24px;">
          Welcome to <span style="color:#ec4899;">TravelEase</span> ✈️
        </h2>

        <p style="color:#c4b5d4;font-size:14px;margin-bottom:25px;">
          Use the verification code below to complete your login
        </p>

        <!-- OTP BOXES -->
        <div style="display:flex;justify-content:center;gap:10px;margin-bottom:25px;">
          ${otpArray
            .map(
              (digit) => `
              <div style="
                width:45px;
                height:55px;
                background:#2d1457;
                border-radius:10px;
                display:flex;
                align-items:center;
                justify-content:center;
                font-size:22px;
                font-weight:bold;
                color:#ec4899;
                border:1px solid rgba(236,72,153,0.3);
                box-shadow:0 0 10px rgba(236,72,153,0.2);
              ">
                ${digit}
              </div>
            `
            )
            .join("")}
        </div>

        <p style="color:#8b7aab;font-size:13px;margin-bottom:20px;">
          This code will expire in <b>5 minutes</b>.
        </p>

        <p style="color:#8b7aab;font-size:12px;">
          If you didn’t request this, you can safely ignore this email.
        </p>

      </div>

      <!-- FOOTER -->
      <div style="background:#0d0520;padding:15px;text-align:center;">
        <p style="color:#8b7aab;font-size:12px;margin:0;">
          © 2025 TravelEase • All Rights Reserved
        </p>
      </div>

    </div>

  </div>
  `;
};

export { generateEmailTemplate };