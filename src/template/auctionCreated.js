module.exports = function generateAuctionCreatedEmail(auction) {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9fafb; color: #333;">
      <h2 style="color: #16a34a;">✅ Your Auction Has Been Created!</h2>

      <p>Hello,</p>

      <p>Your auction <strong>"${auction.title}"</strong> has been successfully created and scheduled. Below are the details:</p>

      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">📌 <strong>Title</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${auction.title}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">🕒 <strong>Start Time</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${new Date(auction.start_time).toLocaleString()}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">⏰ <strong>End Time</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${new Date(auction.end_time).toLocaleString()}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">💰 <strong>Minimum Bid</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">₹${auction.min_bid_price}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">🔗 <strong>Join Link</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">
            <a href="https://agrimarket.vercel.app/auction/${auction.slug}" style="color: #16a34a; text-decoration: underline;" target="_blank">
              Join Auction
            </a>
          </td>
        </tr>
      </table>

      <p>If you have any questions or need assistance, feel free to reply to this email.</p>

      <p style="margin-top: 30px;">Best regards,<br/><strong>AgriMarket Team</strong></p>
    </div>
  `;
};
