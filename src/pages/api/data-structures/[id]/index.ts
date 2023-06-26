import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { dataStructureValidationSchema } from 'validationSchema/data-structures';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.data_structure
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getDataStructureById();
    case 'PUT':
      return updateDataStructureById();
    case 'DELETE':
      return deleteDataStructureById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getDataStructureById() {
    const data = await prisma.data_structure.findFirst(convertQueryToPrismaUtil(req.query, 'data_structure'));
    return res.status(200).json(data);
  }

  async function updateDataStructureById() {
    await dataStructureValidationSchema.validate(req.body);
    const data = await prisma.data_structure.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteDataStructureById() {
    const data = await prisma.data_structure.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
