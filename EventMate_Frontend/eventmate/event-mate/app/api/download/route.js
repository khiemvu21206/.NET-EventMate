export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");
  const filename = searchParams.get("filename") || "download";

  if (!url) {
    return new Response(JSON.stringify({ error: "Thiếu URL" }), { status: 400 });
  }

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Lỗi tải file");

    const blob = await response.blob();
    const buffer = await blob.arrayBuffer();

    return new Response(buffer, {
      headers: {
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Type": response.headers.get("content-type"),
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Lỗi tải file" }), { status: 500 });
  }
}
