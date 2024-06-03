import express, { type Request, type Response, type Router } from "express"
import { createServerClient } from "@supaviteexpress/supabase-client"
import { AuthError } from "@supabase/supabase-js"

const authRouter: Router = express.Router()

authRouter.get("/", (_req: Request, res: Response) => {
  res.send({ data: "User router is ripping and good to go!" }).status(200)
})

authRouter.get("/currentSession", async (req: Request, res: Response) => {
  const supabase = createServerClient({ req, res })

  const { data, error } = await supabase.auth.getSession()

  console.log({data})
  console.log({error})
  if (error) {
    return res.send({ error: "There was an error getting the current user session", errorMessage: error?.message })
  }

  res.send({ data }).status(200)
})

authRouter.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const supabase = createServerClient({ req, res })

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
  
    if (error) {
      console.log({error})
      throw error
    }

    console.log("DATA FROM THE LOGIN ROUTE")
    console.log({data})
    res.send({ data: data, message: "User successfully logged in" }).status(200)
  } catch(e) {
    const error: AuthError = e as AuthError
    console.error('Error logging in a user: ', error.message)
    return res.send({ error: "There was an error logging in a user", errorMessage: error.message })
  }

})

authRouter.post("/signUp", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const supabase = createServerClient({ req, res })

  console.log({email})
  console.log({password})

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })
  
    if (error) {
      console.log({error})
      throw error
    }

    console.log("DATA FROM THE SIGNUP ROUTE:")
    const { user, session } = data

    if (!session) {
      throw new AuthError("Session from signing up is null")
    }
    const { access_token, refresh_token } = session
    console.log({session})
    console.log({user})
    const { error: setSessionError } = await supabase.auth.setSession({ access_token, refresh_token })

    if (setSessionError) {
      console.error(setSessionError)
      throw setSessionError
    }

    // const { error: setUserError } = await supabase.auth.updateUser(user!)

    // if (setUserError) {
    //   console.error(setUserError)
    //   throw setUserError
    // }

    return res.send({ message: "User successfully registered" }).status(200)

  } catch(e) {
    const error: AuthError = e as AuthError
    console.error('Error registering a user: ', error.message)
    return res.send({ error: "There was an error registering a user", errorMessage: error.message }).status(400)
  }

})

authRouter.get("/loginMagicLink", async (req: Request, res: Response) => {
  const supabase = createServerClient({ req, res })
  const email = (req.query.email ?? "") as string
  const redirectUrl = process.env.API_URL ? `${process.env.API_URL}/auth/callback` : "localhost:5001/auth/callback"

  if (!email) {
    return res.send({ error: "Email was not passed to request query" }).status(501)
  }

  const { error } = await supabase.auth.signInWithOtp({
    email: email,
    options: {
      emailRedirectTo: redirectUrl,
    },
  })

  console.log({error})
  if (error) {
    return res.status(error?.status ?? 429).send({ error: error?.message })
  } 
  res.status(200).send({ data: "Email successfully sent" })
})

authRouter.get("/googleOAuthSignIn", async (req: Request, res: Response) => {
  const supabase = createServerClient({ req, res })
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: '/auth/callback',
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })

  if (error) {
    return res.status(error?.status ?? 500).send({ error: error?.message })
  }
  
  if (data.url) {
    res.redirect(data.url) // use the redirect API for your server framework
  }
  
})

authRouter.get("/callback", async (req, res)  => {
  const code = req.query.code as string
  console.log({code})
  if (code) {
    const supabase = createServerClient({ req, res })
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    console.log({data})
    if (error) {
      console.log({error})
      return res.redirect(303, "/sign-in")
    }
    return res.redirect(303, "/")
  }

  return res.redirect(303, `/sign-in`)
})

authRouter.get("/confirm", async (req: Request, res: Response) => {
  const token_hash = req.query.token_hash as string
  const type = req.query.type as any
  const redirectUrl = process.env.HOST ? `${process.env.HOST}/` : "localhost:3000/"

  if (!token_hash) {
    return res.send({ error: "Token hash not found in query params" }).status(500)
  }

  if (!type) {
    return res.send({ error: "Type not found in query params" }).status(500)
  }

  console.log({type})
  console.log({token_hash})
  const supabase = createServerClient({ req, res })
  const { data, error } = await supabase.auth.verifyOtp({
    type,
    token_hash,
  })
  console.log({data})
  console.log({error})
  if (error || !data?.session) {
    return res.redirect(303, '/auth/auth-code-error')
  }

  const userData = data?.user
  const { access_token, refresh_token } = data.session

  const { error: sessionError } = await supabase.auth.setSession({
    access_token: access_token,
    refresh_token: refresh_token
  })

  if (sessionError) {
    return res.send({ error: "There was an error setting the supabase session", errorMessage: sessionError?.message }).status(500)
  }

  const { error: userError } = await supabase.auth.updateUser(userData!)

  if (userError) {
    return res.send({ error: "There was an error updating the supabase user", errorMessage: userError?.message }).status(500)
  }

  return res.redirect(303, redirectUrl)

})

authRouter.get("/logout", async (req: Request, res: Response) => {
  const supabase = createServerClient({ req, res })

  const { error } = await supabase.auth.signOut()

  if (error) {
    return res.status(error?.status ?? 500).send({ error: error.message })
  }

  res.redirect(303, "/sign-in")
})

export default authRouter