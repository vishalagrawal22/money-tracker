import { Button } from "react-bootstrap";
import Image from "next/image";

import { loginOrRegisterWithGooglePopup } from "../utils/auth/client";

function GoogleAuthButton({ type }) {
  return (
    <Button
      variant="outline-dark"
      className="w-100 d-flex align-items-center"
      onClick={async () => {
        await loginOrRegisterWithGooglePopup(type);
      }}
    >
      <Image
        className="mx-2"
        src={"/google-logo.svg"}
        alt="Google logo"
        height="30"
        width="30"
      />
      <span className="ml-2">Continue with Google</span>
    </Button>
  );
}

export default GoogleAuthButton;
