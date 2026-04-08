const generateEmailTemplate = (verificationCode) => {
  const otpArray = verificationCode.split("");

  return `
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1f8;padding:40px 16px;font-family:Arial,sans-serif;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:460px;background:#1a0a2e;border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,0.1);">

          <!-- HEADER -->
          <tr>
            <td style="background:#2d1457;padding:28px 28px 20px;text-align:center;">
              <table cellpadding="0" cellspacing="0" style="margin:0 auto 16px;">
                <tr>
                  <td style="background:rgba(253,224,139,0.15);border:1px solid rgba(253,224,139,0.3);border-radius:50px;padding:6px 18px;">
                    <span style="font-size:13px;font-weight:600;color:#fde08b;letter-spacing:0.5px;">TravelEase ✈️</span>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 6px;font-size:20px;font-weight:700;color:#fef9ec;">Verify your login</p>
              <p style="margin:0;font-size:13px;color:#c4b5d4;line-height:1.6;">
                Use the code below to complete your login.<br/>It expires in 5 minutes.
              </p>
            </td>
          </tr>

          <!-- OTP SECTION -->
          <tr>
            <td style="background:#130830;padding:28px 28px 24px;text-align:center;">
              <p style="margin:0 0 16px;font-size:11px;font-weight:600;letter-spacing:1.4px;color:#a08dbe;text-transform:uppercase;">
                Your one-time code
              </p>

              <!-- OTP BOXES -->
              <table cellpadding="0" cellspacing="0" style="margin:0 auto 22px;">
                <tr>
                  ${otpArray
                    .map(
                      (digit) => `
                    <td style="padding:0 4px;">
                      <table cellpadding="0" cellspacing="0">
                        <tr>
                          <td width="44" height="52" style="
                            background:#1e0d3a;
                            border:1px solid rgba(253,224,139,0.35);
                            border-radius:10px;
                            text-align:center;
                            vertical-align:middle;
                            font-size:22px;
                            font-weight:700;
                            color:#fde08b;
                            width:44px;
                            height:52px;
                          ">${digit}</td>
                        </tr>
                      </table>
                    </td>
                  `,
                    )
                    .join("")}
                </tr>
              </table>

              <!-- EXPIRY BOX -->
              <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:16px;">
                <tr>
                  <td style="background:rgba(253,224,139,0.07);border:1px solid rgba(253,224,139,0.15);border-radius:8px;padding:10px 16px;text-align:center;">
                    <span style="font-size:12px;color:#a08dbe;">
                      This code is valid for <span style="color:#fde08b;font-weight:600;">5 minutes</span> only.
                    </span>
                  </td>
                </tr>
              </table>

              <p style="margin:0;font-size:11px;color:#6b5a82;">
                Didn't request this? You can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background:#0d0520;padding:14px 20px;text-align:center;border-top:1px solid rgba(255,255,255,0.05);">
              <p style="margin:0;font-size:11px;color:#6b5a82;">© 2025 TravelEase • All Rights Reserved</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
  `;
};

export { generateEmailTemplate };
