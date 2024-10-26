"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type UserInfoModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSubmit: (name: string, email: string) => Promise<void>;
  loading: boolean;
};

const UserInfoModal: React.FC<UserInfoModalProps> = ({ isOpen, setIsOpen, onSubmit, loading }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleInformationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(name, email);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-full md:max-w-[425px] z-50">
        <form onSubmit={handleInformationSubmit}>
          <DialogHeader>
            <DialogTitle>Let’s help you out!</DialogTitle>
            <DialogDescription>I just need a few details to get started.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@gmail.com"
                className="col-span-3"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={!name || !email || loading}>
              {!loading ? "Continue" : "Loading..."}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserInfoModal;
