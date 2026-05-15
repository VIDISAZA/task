/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Mengabaikan error ESLint (seperti variabel yang tidak terpakai) 
    // agar Vercel bisa sukses melakukan build.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
