import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {BarLoader} from "react-spinners";

const Onboarding = () => {
  const { user, isLoaded} = useUser();
  const navigate = useNavigate()

  const handleRoleSelection=async(role)=>{
    await user
    .update({
      unsafeMetadata: { role },
    })
    .then(()=>{
      navigate(role === "recruiter" ? "/post-job" : "/jobs");
    })
    .catch((err) => {
      console.error("Lỗi cập nhật vai trò: ", err);
    });
  };

  useEffect(() => {
    if(user?.unsafeMetadata?.role){
      navigate(
        user?.unsafeMetadata?.role === "recruiter" ? "/post-job" : "/jobs");
      
    }
  }, [user]);


  if (!isLoaded){
    return <BarLoader clasName="mb-4" width={"100%"} color="#36d7b7"/>;
  }
  return (
    <div className="flex flex-col items-center justify-center mt-32">
      <h2 className="gradient-title font-extrabold text-7xl sm:text-8xl tracking-tighter">
        Tôi là một...
        </h2>
        <div className="mt-16 grid grid-cols-2 gap-4 w-full md:px40">
          <Button 
            variant="blue" 
            className="h-36 text-2x1" 
            onClick={()=>handleRoleSelection("candidate")}>
              Ứng viên
            </Button>
            <Button 
              variant="destructive" 
              className="h-36 text-2x1"
              onClick={()=>handleRoleSelection("recruiter")}>
                Nhà tuyển dụng
            </Button>
        </div>

    </div>
  );
};

export default Onboarding
