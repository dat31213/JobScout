import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "./ui/button";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from "@/components/ui/drawer"
import { useForm } from "react-hook-form";
import { Input } from "./ui/input";
import useFetch from "@/hooks/use-fetch";
import { addNewCompanies } from "@/api/apiCompanies";
import { BarLoader } from "react-spinners";
import { useEffect } from "react";
  

const schema = z.object({
    name: z.string().min(1, {message: "Yêu cầu tên"}),
    logo:z
    .any()
    .refine((file) => 
        file[0] && 
        (file[0].type === "image/png"
        || file[0].type === "image/jpeg"),
        {message: "Chỉ cho phép hình ảnh"}
    ),
})

const AddCompanyDrawer = ({fetchCompanies}) => {
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm({
        resolver: zodResolver(schema),
    });

    const {
        loading: loadingAddCompany,
        error: errorAddCompany,
        data: dataAddCompany,
        fn: fnAddCompany
    } = useFetch(addNewCompanies);

    const onSubmit = (data) => {
        fnAddCompany({
            ...data,
            logo: data.logo[0],

        })
    }
    useEffect(()=>{
        if(dataAddCompany?.length>0) fetchCompanies();
    }, [loadingAddCompany])




  return (
    <Drawer>
        <DrawerTrigger>
            <Button type="button" size="sm" variant="secondary">
                Thêm công ty
            </Button>
        </DrawerTrigger>
        <DrawerContent>
            <DrawerHeader>
                <DrawerTitle>
                    Thêm một công ty mới
                </DrawerTitle>
            </DrawerHeader>
            <form className="flex gap-2 p-4 pb-0">
                <Input placeholder="Tên công ty" {...register("name")}/>
                <Input
                type="file"
                accept="image/*"
                className="file:text-gray-500"
                {...register("logo")}
                />
                <Button
                type="button"
                onClick={handleSubmit(onSubmit)}
                variant="destructive"
                className="w-40"
                >
                    Thêm
                </Button>
            </form>
            {errors.name && <p className="text-red-500">{errors.name.message}</p>}
            {errors.logo && <p className="text-red-500">{errors.logo.message}</p>}
            {errorAddCompany?.message && (
                <p className="text-red-500">{errorAddCompany?.message}</p>
            )}
            {loadingAddCompany && <BarLoader width={"100%"} color="#36d7b7"/>}

            <DrawerFooter>
                <DrawerClose asChild>
                    <Button variant="outline" type="button">Huỷ</Button>
                </DrawerClose>
            </DrawerFooter>
        </DrawerContent>
    </Drawer>
  );
}

export default AddCompanyDrawer