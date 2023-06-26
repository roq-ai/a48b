import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { pdfFileValidationSchema } from 'validationSchema/pdf-files';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getPdfFiles();
    case 'POST':
      return createPdfFile();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getPdfFiles() {
    const data = await prisma.pdf_file
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'pdf_file'));
    return res.status(200).json(data);
  }

  async function createPdfFile() {
    await pdfFileValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.data_structure?.length > 0) {
      const create_data_structure = body.data_structure;
      body.data_structure = {
        create: create_data_structure,
      };
    } else {
      delete body.data_structure;
    }
    if (body?.extracted_data?.length > 0) {
      const create_extracted_data = body.extracted_data;
      body.extracted_data = {
        create: create_extracted_data,
      };
    } else {
      delete body.extracted_data;
    }
    const data = await prisma.pdf_file.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
