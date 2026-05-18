const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  experimental: { workerThreads: false, cpus: 1 }
}
module.exports = nextConfig
