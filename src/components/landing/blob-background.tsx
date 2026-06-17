"use client";

export function BlobBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div
        className="blob-1"
        style={{
          position: "absolute",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          filter: "blur(80px)",
          opacity: 0.45,
          background: "radial-gradient(circle, #a0f0d0, #4dd9f5)",
          top: "-100px",
          left: "-150px",
          animation: "blobFloat 10s ease-in-out infinite alternate",
        }}
      />
      <div
        className="blob-2"
        style={{
          position: "absolute",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          filter: "blur(80px)",
          opacity: 0.45,
          background: "radial-gradient(circle, #b8eaff, #72c8f8)",
          bottom: "-100px",
          right: "-100px",
          animation: "blobFloat 10s ease-in-out infinite alternate",
          animationDelay: "3s",
        }}
      />
      <div
        className="blob-3"
        style={{
          position: "absolute",
          width: "350px",
          height: "350px",
          borderRadius: "50%",
          filter: "blur(80px)",
          opacity: 0.45,
          background: "radial-gradient(circle, #d0f8e8, #8de8f5)",
          top: "40%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          animation: "blobFloat 10s ease-in-out infinite alternate",
          animationDelay: "1.5s",
        }}
      />
    </div>
  );
}
