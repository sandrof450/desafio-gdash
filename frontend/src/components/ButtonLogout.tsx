import { Button } from "../components/ui/button";
import { LogOut } from "lucide-react";


interface ButtonLogoutProps {
  onLogout: () => void;
 }


const ButtonLogout: React.FC<ButtonLogoutProps> = (props: ButtonLogoutProps) => {
  return (
    <div className="fixed bottom-4 right-4 z-10">
      <Button onClick={props.onLogout} className="bg-red-600 hover:bg-red-700">
        <LogOut className="mr-2 h-4 w-4" /> Logout
      </Button>
    </div>
  );
};

export default ButtonLogout;
