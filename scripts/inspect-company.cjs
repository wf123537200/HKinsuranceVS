const { PrismaClient } = require("../app/generated/prisma");
const p = new PrismaClient();
p.company
  .findUnique({
    where: { slug: "prudential-hk" },
    select: {
      name: true,
      slug: true,
      displayName: true,
      region: true,
      country: true,
      website: true,
      foundedYear: true,
      headquarters: true,
      description: true,
      logoUrl: true,
      regulator: true,
      amBestRating: true,
      moodysRating: true,
      spRating: true,
      fitchRating: true,
    },
  })
  .then((c) => {
    console.log(JSON.stringify(c, null, 2));
    return p.$disconnect();
  });
