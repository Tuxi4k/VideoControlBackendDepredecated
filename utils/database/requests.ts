import { JsonValue } from "@prisma/client/runtime/library";
import prisma from "./engine";

interface user {
  id: number;
  email: string;
  fio: string;
  agreement: string;
  phone: string;
  address: string;
  house: string;
  tags: JsonValue;
  createdAt: Date;
  updatedAt: Date;
}

async function getContacts(): Promise<user[]> {
  return await prisma.contact.findMany();
}

async function getContact(id: number): Promise<user | void> {
  const user = await prisma.contact.findUnique({
    where: { id: id },
  });
  if (user) {
    return user;
  } else return;
}

async function addContact(user: user): Promise<boolean> {
  const newUser = await prisma.contact.create({
    data: user,
  });

  return !!newUser;
}

async function updateContact(id: number, user: user): Promise<boolean> {
  const upUser = await prisma.contact.update({
    where: { id: id },
    data: user,
  });
  return !!upUser;
}

async function deleteContact(id: number): Promise<boolean> {
  const delUser = await prisma.contact.delete({
    where: { id: id },
  });

  return !!delUser;
}

export { getContacts, getContact, addContact, updateContact, deleteContact };
