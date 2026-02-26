export default function BadgePreview({ badgeData }) {
  return (
    <div
      style={{
        width: "300px",
        height: "400px",
        backgroundColor: badgeData.bgColor,
        color: badgeData.textColor,
        borderRadius: "15px",
        padding: "20px",
        textAlign: "center",
        boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
      }}
    >
      {badgeData.image && (
        <img
          src={badgeData.image}
          alt="Uploaded"
          style={{ width: "100px", height: "100px", borderRadius: "50%" }}
        />
      )}

      <h2>{badgeData.title}</h2>
      <p>{badgeData.subtitle}</p>                                    
    </div>
  );
}