import { Response } from "express";

export const exportToJSON = (
  res: Response,
  data: any,
  filename: string
) => {
  res.setHeader(
    "Content-Type",
    "application/json"
  );

  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${filename}.json`
  );

  res.send(JSON.stringify(data, null, 2));
};

export const exportToCSV = (
  res: Response,
  data: any[],
  filename: string
) => {
  if (!data.length) {
    return res
      .status(400)
      .json({ message: "No data to export" });
  }

  const headers = Object.keys(data[0]).join(",");

  const rows = data
    .map((item) =>
      Object.values(item)
        .map((v) => `"${v}"`)
        .join(",")
    )
    .join("\n");

  const csv = `${headers}\n${rows}`;

  res.setHeader(
    "Content-Type",
    "text/csv"
  );

  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${filename}.csv`
  );

  res.send(csv);
};