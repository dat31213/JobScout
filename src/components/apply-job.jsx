import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from "@/components/ui/drawer"  
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { z } from "zod";
import {zodResolver} from "@hookform/resolvers/zod"
// import { P } from "@clerk/clerk-react/dist/useAuth-D1ySo1Ar";
import { Controller, useForm } from "react-hook-form";
import useFetch from "@/hooks/use-fetch";
import { applyToJob } from "@/api/apiApplications";
import { BarLoader } from "react-spinners";


const schema = z.object({
    experience:z.number().min(0, {message: "Kinh nghiệm phải ít nhất là 0"}).int(),
    skills: z.string().min(1, {message: "Kỹ năng cần có"}),
    education:z.enum(["Intermediate", "Graduate", "Post Graduate"], {
        message: "Yêu cầu bằng cấp",
    }),
    resume: z
    .any()
    .refine(
      (file) =>
        file[0] &&
        (file[0].type === "application/pdf" ||
          file[0].type === "application/msword"),
      { message: "Chỉ cho phép tài liệu Word hoặc fild PDF" }
    ),
});
    

const ApplyJobDrawer = ({user, job, applied = false, fetchJob}) => {
    const {
        register, 
        handleSubmit, 
        control, 
        formState:{errors}, 
        reset
    } = useForm({
            resolver: zodResolver(schema),
    });

    const {
        loading: loadingApply,
        error: errorApply,
        fn: fnApply,
    } = useFetch(applyToJob);

    const onSubmit=(data) => {
        if (!data.resume || data.resume.length === 0) { console.error("Resume is required"); return; }
        fnApply({
            ...data,
            job_id: job.id,
            candidate_id: user.id,
            name: user.fullName,
            status: "applied",
            resume: data.resume[0],
        }).then(()=> {
            fetchJob();
            reset();
        })
    }

    return (
        <Drawer open = {applied ? false : undefined}>
        <DrawerTrigger asChild>
            <Button 
            size='lg'
            variant={job?.isOpen && !applied ? "blue" : "destructive"}
            disabled={!job?.isOpen || applied}
            >
                {job?.isOpen ? (applied ? "Đã ứng tuyển" : "Ứng tuyển") : "Ngưng tuyển dụng"}
            </Button>
        </DrawerTrigger>
        <DrawerContent>
            <DrawerHeader>
            <DrawerTitle>Ứng tuyển {job?.title} ở {job?.company?.name}</DrawerTitle>
            <DrawerDescription>Vui lòng điền thông tin bên dưới.</DrawerDescription>
            </DrawerHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4 pb-0">
                <Input 
                type="number"
                placeholder="Bao nhiêu năm kinh nghiệm"
                className="flex-1"
                {...register("experience",{
                    valueAsNumber: true,
                })}
                />
                {errors.experience && (
                    <p className="text-red-500">{errors.experience.message}</p>
                )}
                <Input type="text"
                placeholder="Kỹ năng (cách nhau bằng dấu phẩy)"
                className="flex-1"
                {...register("skills")}
                />
                {errors.skills && (
                    <p className="text-red-500">{errors.skills.message}</p>
                )}

                <Controller
                name='education'
                control={control}
                render={({field}) => (
                    <RadioGroup 
                    onValueChange={field.onChange}
                    {...field}
                    >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Intermediate" id="Intermediate" />
                        <Label htmlFor="Intermediate">Trung cấp</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Graduate" id="Graduate" />
                        <Label htmlFor="Graduate">Đại học</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Post Graduate" id="post-graduate" />
                        <Label htmlFor="post-raduate">Sau Đại học</Label>
                    </div>
                </RadioGroup>
                )}
                />

                {errors.education && (
                    <p className="text-red-500">{errors.education.message}</p>
                )}

                <Input
                    type="file"
                    accept=".pdf, .doc, .docx"
                    className="flex-1 file:text-gray-500"
                    {...register("resume")}
                />
                {errors.resume && (
                    <p className="text-red-500">{errors.resume.message}</p>
                )}
                {errorApply?.message && (
                    <p className="text-red-500">{errorApply?.message}</p>
                )}
                {loadingApply && <BarLoader width={"100%"} color="#36d7b7"/>}


                 <Button type="submit" variant="blue" size="lg">Ứng tuyển</Button>
            </form>

            <DrawerFooter>
           
            <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
            </DrawerClose>
            </DrawerFooter>
        </DrawerContent>
        </Drawer>

    );
};

export default ApplyJobDrawer