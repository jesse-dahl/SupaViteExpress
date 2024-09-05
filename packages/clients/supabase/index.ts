import { createServerClient as createSSRClient } from "@supabase/ssr"
import { createClient } from "@supabase/supabase-js"
import { logger } from "@sve/logger"
import { type Request, type Response } from "express"

const SUPABASE_URL = process.env.SUPABASE_URL ?? ""
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY ?? ""

export const createServerClient = (context: { req: Request; res: Response }) => {

  return createSSRClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      get: (key) => {
        const cookies = context.req.cookies
        const cookie = cookies?.[key] ?? ''
        logger.debug('COOKIES OBJECT: ', cookies, '/packages/clients/supabase', 'index.ts')
        return decodeURIComponent(cookie)
      },
      set: (key, value, options) => {
        if (!context.res) return
        context.res.cookie(key, encodeURIComponent(value), {
          ...options,
          sameSite: 'Lax',
          httpOnly: false,
        })
      },
      remove: (key, options) => {
        if (!context.res) return
        context.res.cookie(key, '', { ...options, httpOnly: true })
      },
    },
  })
}

export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)