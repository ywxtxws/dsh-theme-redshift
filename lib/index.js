/**
 * 赤色观测站 — Host 半侧
 *
 * 把主题用到的静态资源（程序化生成的背景场景）以只读路由挂到 web 服务器上，
 * 浏览器半侧用 URL 引用，不把几百 KB 的 base64 塞进客户端脚本。
 *
 * ⚠ 刻意不导出 default：cordis-plugin-loader 的 unwrapExports 是
 *   `exports.default ?? exports` —— 一旦有 default，具名导出
 *   （name / inject / apply）会被整个丢掉，插件会“加载了但不生效”。
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const name = 'dsh-theme-redshift'
export const inject = ['webServer']

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ASSETS = path.join(HERE, '..', 'assets')
const ROUTE_PREFIX = '/redshift'

// 白名单：只放行这几个文件，不做目录穿越
const FILES = {
  'scene.jpg': 'image/jpeg',
}

export function apply(ctx) {
  ctx.effect(() =>
    ctx.webServer.register({
      kind: 'prefix',
      path: ROUTE_PREFIX,
      handler(req, res) {
        if (req.method !== 'GET' && req.method !== 'HEAD') {
          res.statusCode = 405
          res.setHeader('Allow', 'GET, HEAD')
          res.end()
          return
        }

        const name = decodeURIComponent(new URL(req.url || '/', 'http://localhost').pathname.slice(ROUTE_PREFIX.length + 1))
        const type = FILES[name]
        if (!type) {
          res.statusCode = 404
          res.setHeader('Content-Type', 'text/plain; charset=utf-8')
          res.end('redshift asset not found')
          return
        }

        const file = path.join(ASSETS, name)
        fs.stat(file, (error, stat) => {
          if (error || !stat.isFile()) {
            res.statusCode = 404
            res.end()
            return
          }

          res.setHeader('Content-Type', type)
          res.setHeader('Content-Length', String(stat.size))
          // ⚠ 不能给 immutable / 长 max-age：这几个文件在开发中会被反复替换，
          //   浏览器一旦缓存就看不到新图（2026-10-28 踩过一次）。
          res.setHeader('Cache-Control', 'no-cache, must-revalidate')

          if (req.method === 'HEAD') {
            res.end()
            return
          }

          fs.createReadStream(file)
            .on('error', () => res.destroy())
            .pipe(res)
        })
      },
    }),
  )
}
