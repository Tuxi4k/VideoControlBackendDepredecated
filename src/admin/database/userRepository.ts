// src/admin/database/userRepository.ts
import { Prisma } from "@prisma/client";
import prisma from "@config/database";
import type { Contact, User, CreateContactData } from "@/types/requests";

export class UserRepository {
  async getContacts(): Promise<Contact[]> {
    return await prisma.contact.findMany();
  }

  async getContact(id: number): Promise<Contact | null> {
    return await prisma.contact.findUnique({
      where: { id },
    });
  }

  async addContact(contactData: CreateContactData): Promise<boolean> {
    const newContact = await prisma.contact.create({
      data: {
        fio: contactData.fio,
        phone: contactData.phone,
        address: contactData.address,
        house: contactData.house,
        agreement: contactData.agreement,
        email: contactData.email || null,
        tags: contactData.tags ? contactData.tags : Prisma.JsonNull,
      },
    });

    return !!newContact;
  }

  async updateContact(
    id: number,
    contactData: Prisma.ContactUpdateInput
  ): Promise<boolean> {
    const updatedContact = await prisma.contact.update({
      where: { id },
      data: contactData,
    });

    return !!updatedContact;
  }

  async deleteContact(id: number): Promise<boolean> {
    const deletedContact = await prisma.contact.delete({
      where: { id },
    });

    return !!deletedContact;
  }

  // Методы для аутентификации
  async findByUsername(username: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { username },
    });
  }

  async updateRefreshToken(
    username: string,
    refreshToken: string | null
  ): Promise<void> {
    await prisma.user.update({
      where: { username },
      data: { lastToken: refreshToken },
    });
  }
}
