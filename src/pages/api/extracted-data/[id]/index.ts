import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { extractedDataValidationSchema } from 'validationSchema/extracted-data';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.extracted_data
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getExtractedDataById();
    case 'PUT':
      return updateExtractedDataById();
    case 'DELETE':
      return deleteExtractedDataById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getExtractedDataById() {
    const data = await prisma.extracted_data.findFirst(convertQueryToPrismaUtil(req.query, 'extracted_data'));
    return res.status(200).json(data);
  }

  async function updateExtractedDataById() {
    await extractedDataValidationSchema.validate(req.body);
    const data = await prisma.extracted_data.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteExtractedDataById() {
    const data = await prisma.extracted_data.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
