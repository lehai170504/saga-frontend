"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";
import { SocialLogin } from "./social-login";

export function AuthModal() {
  const [isOpen, setIsOpen] = useState(false);

  const handleSuccess = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl px-6 shadow-sm transition-all hover:-translate-y-0.5">
          Đăng nhập / Đăng ký
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden rounded-2xl">
        <div className="p-6 pb-2">
          <DialogHeader className="flex flex-col items-center">
            <Image
              src="/logo-icon.png"
              alt="SAGA Logo"
              width={300}
              height={48}
              className="w-auto h-10 sm:h-12 object-contain drop-shadow-sm mb-2"
              style={{ width: "auto" }}
              priority
            />
            <DialogTitle className="text-2xl font-extrabold text-center bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              SAGA Dashboard
            </DialogTitle>
            <DialogDescription className="text-center text-muted-foreground font-medium">
              Hệ thống đánh giá liên tục PBL
            </DialogDescription>
          </DialogHeader>
        </div>
        <Tabs defaultValue="login" className="w-full">
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-2 bg-muted p-1 rounded-xl">
              <TabsTrigger
                value="login"
                className="rounded-xl font-semibold data-[state=active]:bg-background data-[state=active]:text-orange-600 data-[state=active]:shadow-sm"
              >
                Đăng nhập
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="rounded-xl font-semibold data-[state=active]:bg-background data-[state=active]:text-orange-600 data-[state=active]:shadow-sm"
              >
                Đăng ký
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-6 pt-4 bg-muted/30 mt-2">
            <TabsContent value="login" className="mt-0 outline-none">
              <LoginForm onSuccess={handleSuccess} />
            </TabsContent>

            <TabsContent value="register" className="mt-0 outline-none">
              <RegisterForm onSuccess={handleSuccess} />
            </TabsContent>

            <SocialLogin />
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
