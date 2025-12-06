import { SignIn } from "@clerk/clerk-react";
import { useLanguage } from "../contexts/LanguageContext";
import { translations } from "../translations";

function SignInPage() {
  const { language } = useLanguage();
  const t = translations[language];
  return (
    <>
      <style>
        {`
          .cl-card {
            box-shadow: none !important;
            border: none !important;
            background: transparent !important;
            padding: 0 !important;
          }
          .cl-cardBox {
            box-shadow: none !important;
            border: none !important;
            background: transparent !important;
            padding: 0 !important;
          }
          .cl-rootBox {
            box-shadow: none !important;
            border: none !important;
            background: transparent !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            width: 100% !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
            overflow: visible !important;
          }
          .cl-formFieldInput {
            position: relative !important;
            z-index: 10 !important;
            opacity: 1 !important;
            visibility: visible !important;
            border: 1px solid #e0e0e0 !important;
            border-radius: 8px !important;
            padding: 12px 16px !important;
            font-size: 14px !important;
            background-color: #ffffff !important;
            color: #1a1a1a !important;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
            transition: all 0.2s ease !important;
            width: 100% !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
          }
          .cl-identityPreviewEditButton,
          .cl-formFieldInputShowPasswordButton {
            background-color: #ffffff !important;
            color: #2E7D32 !important;
            border: 1px solid #e0e0e0 !important;
            opacity: 1 !important;
            visibility: visible !important;
            z-index: 10 !important;
          }
          .cl-identityPreviewEditButton:hover,
          .cl-formFieldInputShowPasswordButton:hover {
            background-color: #f5f5f5 !important;
            border-color: #2E7D32 !important;
            color: #1B5E20 !important;
          }
          .cl-formFieldInput:focus {
            border-color: #2E7D32 !important;
            box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.1) !important;
            outline: none !important;
          }
          .cl-formFieldInput::placeholder {
            color: #9ca3af !important;
          }
          .cl-button,
          .cl-formButtonPrimary {
            position: relative !important;
            z-index: 10 !important;
            opacity: 1 !important;
            visibility: visible !important;
            border-radius: 8px !important;
            font-weight: 600 !important;
            padding: 12px 24px !important;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
            transition: all 0.2s ease !important;
            width: 100% !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
          }
          .cl-formButtonPrimary {
            background-color: #2E7D32 !important;
            color: #ffffff !important;
          }
          .cl-formButtonPrimary:hover {
            background-color: #1B5E20 !important;
            box-shadow: 0 4px 8px rgba(46, 125, 50, 0.3) !important;
            transform: translateY(-1px) !important;
          }
          .cl-socialButtonsBlockButton {
            position: relative !important;
            z-index: 10 !important;
            opacity: 1 !important;
            visibility: visible !important;
            border: 1px solid #e0e0e0 !important;
            border-radius: 8px !important;
            padding: 12px 24px !important;
            background-color: #ffffff !important;
            color: #1a1a1a !important;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
            transition: all 0.2s ease !important;
            width: 100% !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
          }
          .cl-socialButtonsBlockButton:hover {
            border-color: #2E7D32 !important;
            box-shadow: 0 2px 6px rgba(46, 125, 50, 0.2) !important;
            transform: translateY(-1px) !important;
          }
          .cl-formField,
          .cl-socialButtonsBlock,
          .cl-dividerRow {
            position: relative !important;
            z-index: 10 !important;
            opacity: 1 !important;
            visibility: visible !important;
            width: 100% !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
            overflow: visible !important;
          }
          .cl-dividerRow {
            color: #6b7280 !important;
            font-size: 14px !important;
          }
          .cl-main {
            position: relative !important;
            z-index: 10 !important;
            width: 100% !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
            overflow: visible !important;
          }
          .cl-card,
          .cl-cardBox {
            width: 100% !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
            overflow: visible !important;
          }
          * {
            box-sizing: border-box !important;
          }
          .cl-formFieldLabel {
            color: #374151 !important;
            font-weight: 500 !important;
            font-size: 14px !important;
            margin-bottom: 8px !important;
          }
          .cl-logoImage,
          .cl-logoBox img,
          .cl-logoBox svg {
            width: 120px !important;
            height: 120px !important;
            max-width: 120px !important;
            max-height: 120px !important;
          }
        `}
      </style>
      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          width: "100%",
        }}
      >
        <div
          style={{
            flex: "0 0 35%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#ffffff",
            padding: "2rem 3rem",
            position: "relative",
            overflow: "visible",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "#e5e5f7",
              opacity: 0.3,
              backgroundImage:
                "repeating-radial-gradient( circle at 0 0, transparent 0, #e5e5f7 10px ), repeating-linear-gradient( #81aa5655, #81aa56 )",
              zIndex: 0,
            }}
          />
          <div
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              bottom: 0,
              width: "6px",
              background:
                "linear-gradient(180deg, transparent 0%, rgba(46, 125, 50, 0.4) 20%, rgba(46, 125, 50, 0.6) 50%, rgba(46, 125, 50, 0.4) 80%, transparent 100%)",
              zIndex: 5,
              boxShadow: "2px 0 8px rgba(46, 125, 50, 0.2)",
            }}
          />
          <svg
            style={{
              position: "absolute",
              right: "-60px",
              top: 0,
              bottom: 0,
              width: "120px",
              height: "100%",
              zIndex: 3,
              pointerEvents: "none",
            }}
            viewBox="0 0 120 100"
            preserveAspectRatio="none"
          >
            <path
              d="M 0,0 Q 30,10 60,25 T 120,50 Q 90,65 60,75 T 0,100 L 0,0 Z"
              fill="url(#gradientLeft)"
              opacity="0.08"
            />
            <defs>
              <linearGradient
                id="gradientLeft"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
                <stop offset="50%" stopColor="#2E7D32" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
          <div
            style={{
              position: "absolute",
              right: "-2px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "8px",
              height: "200px",
              background:
                "linear-gradient(180deg, rgba(46, 125, 50, 0.2), rgba(46, 125, 50, 0.5), rgba(46, 125, 50, 0.2))",
              borderRadius: "4px",
              zIndex: 6,
              boxShadow: "0 0 12px rgba(46, 125, 50, 0.3)",
            }}
          />
          <div
            style={{
              width: "100%",
              maxWidth: "380px",
              position: "relative",
              zIndex: 10,
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "2rem 0",
              boxSizing: "border-box",
            }}
          >
            <SignIn
              routing="path"
              path="/sign-in"
              signUpUrl={null}
              forceRedirectUrl="/"
              appearance={{
                elements: {
                  footer: { display: "none" },
                  rootBox: {
                    boxShadow: "none",
                    backgroundColor: "transparent",
                    border: "none",
                    width: "100%",
                  },
                  card: {
                    boxShadow: "none",
                    backgroundColor: "transparent",
                    border: "none",
                    padding: 0,
                    width: "100%",
                  },
                  cardBox: {
                    boxShadow: "none",
                    backgroundColor: "transparent",
                    border: "none",
                    padding: 0,
                    width: "100%",
                  },
                  main: {
                    boxShadow: "none",
                    backgroundColor: "transparent",
                    width: "100%",
                  },
                },
              }}
            />
          </div>
        </div>
        <div
          style={{
            flex: "1",
            backgroundImage: "url('/intelpvbg.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "3rem",
          }}
        >
          <svg
            style={{
              position: "absolute",
              left: "-60px",
              top: 0,
              bottom: 0,
              width: "120px",
              height: "100%",
              zIndex: 3,
              pointerEvents: "none",
            }}
            viewBox="0 0 120 100"
            preserveAspectRatio="none"
          >
            <path
              d="M 120,0 Q 90,10 60,25 T 0,50 Q 30,65 60,75 T 120,100 L 120,0 Z"
              fill="url(#gradientRight)"
              opacity="0.12"
            />
            <defs>
              <linearGradient
                id="gradientRight"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#2E7D32" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#2E7D32" stopOpacity="0.15" />
                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "linear-gradient(to left, rgba(46, 125, 50, 0.7), rgba(46, 125, 50, 0.4))",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: "100px",
              background:
                "linear-gradient(to right, rgba(46, 125, 50, 0.3), transparent)",
              zIndex: 1,
            }}
          />
          <div
            style={{
              position: "relative",
              zIndex: 2,
              maxWidth: "700px",
              width: "100%",
              color: "#ffffff",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h1
              style={{
                fontSize: "3.5rem",
                fontWeight: "600",
                marginBottom: "1.5rem",
                lineHeight: "1.2",
                textShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
                fontFamily: "'Poppins', sans-serif",
                letterSpacing: "-0.02em",
              }}
            >
              {t.signIn.welcome}
            </h1>
            <p
              style={{
                fontSize: "1.25rem",
                lineHeight: "1.6",
                opacity: 0.95,
                textShadow: "0 1px 5px rgba(0, 0, 0, 0.2)",
                fontFamily: "'Poppins', sans-serif",
                marginBottom: "3rem",
              }}
            >
              {t.signIn.description}
            </p>
            <div
              style={{
                marginTop: "2rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <p
                style={{
                  fontSize: "1rem",
                  opacity: 0.9,
                  fontFamily: "'Poppins', sans-serif",
                  marginBottom: "1rem",
                }}
              >
                {t.signIn.developedBy}
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "2rem",
                }}
              >
                <img
                  src="/gep.png"
                  alt="Green Energy Park"
                  style={{
                    height: "60px",
                    width: "auto",
                    filter: "brightness(0) invert(1)",
                    objectFit: "contain",
                  }}
                />
                <img
                  src="/iresen.png"
                  alt="IRESEN"
                  style={{
                    height: "60px",
                    width: "auto",
                    filter: "brightness(0) invert(1)",
                    objectFit: "contain",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignInPage;
