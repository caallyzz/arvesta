import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import img from '../assets/image.png'

function InputField({ type = 'text', value, onChange, placeholder, icon: Icon }) {
  const [show, setShow] = useState(false)
  const isPassword = type === 'password'

  return (
    <div style={styles.inputWrapper}>
      {Icon && <Icon style={styles.icon} />}
      <input
        type={isPassword ? (show ? 'text' : 'password') : type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={styles.input}
      />
      {isPassword && (
        <button type="button" onClick={() => setShow(!show)} style={styles.eyeBtn}>
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      )}
    </div>
  )
}

export default function AuthPage() {
  const { login, register } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [buttonHover, setButtonHover] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({ username: '', email: '', password: '' })

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (mode === 'login') {
      const res = await login({ email: form.email, password: form.password })
      if (res.success) {
        navigate('/dashboard')
      } else {
        setError(res.message || 'Login failed. Please try again.')
      }
    } else {
      const res = await register(form)
      if (res.success) {
        setMode('login')
        setError('')
      } else {
        setError(res.message || 'Registration failed. Please try again.')
      }
    }
  }

  return (
    <div style={styles.container}>
      {/* LEFT */}
      <div style={styles.left}>
        <div>
          <p style={styles.est}>EST. 2024</p>
          <h1 style={styles.title}>Arvesta.</h1>
          <p style={styles.desc}>
            Experience the art of financial curation. Elevate your wealth
            management with precision, clarity, and bespoke editorial design.
          </p>
          <img src={img} alt="illustration" style={styles.image}/>
        </div>
      </div>

      {/* RIGHT */}
      <div style={styles.right}>
        <div style={styles.card}>
          <p style={styles.brand}>Arvesta Finance</p>
          <h2 style={styles.heading}>
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p style={styles.sub}>
            {mode === 'login'
              ? 'Access your curated financial dashboard'
              : 'Start your financial journey with us'}
          </p>

          <form onSubmit={handleSubmit} style={styles.form}>
            {error && <div style={styles.errorMessage}>{error}</div>}
            
            {mode === 'register' && (
              <InputField
                placeholder="Name"
                value={form.username}
                onChange={handleChange('username')}
                icon={User}
              />
            )}

            <InputField
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange('email')}
              icon={Mail}
            />

            <InputField
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange('password')}
              icon={Lock}
            />

            {mode === 'login' && (
              <div style={styles.row}>
                <label style={styles.remember}>
                  <input type="checkbox" style={styles.checkbox} /> Remember me
                </label>
                <span style={styles.link}>Forgot Password?</span>
              </div>
            )}

            <button 
              style={{
                ...styles.button,
                ...(buttonHover && styles.buttonHover)
              }}
              onMouseEnter={() => setButtonHover(true)}
              onMouseLeave={() => setButtonHover(false)}
            >
              {mode === 'login' ? 'Login' : 'Register'}
            </button>
          </form>

          <p style={styles.switch}>
            {mode === 'login' ? 'New to Arvesta ecosystem? ' : 'Already have an account? '}
            <span onClick={() => setMode(mode === 'login' ? 'register' : 'login')} style={styles.linkStrong}>
              {mode === 'login' ? 'Create an Account' : 'Login'}
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    fontFamily: 'Inter, sans-serif',
    background: 'linear-gradient(90deg,#f5e6d3,#e8f0ea)'
  },
  left: {
    flex: 1,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingTop: '70px'
  },
  title: {
    fontSize: '52px',
    fontWeight: '600',
    color: '#1f4d2e'
  },
  est: {
    fontSize: '12px',
    color: '#888',
    letterSpacing: '1px'
  },
  desc: {
    maxWidth: '420px',
    color: '#555',
    lineHeight: '1.6',
    marginTop: '10px'
  },
  right: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  card: {
    width: '420px',
    background: '#ffffff',
    padding: '38px',
    borderRadius: '22px',
    boxShadow: '0 20px 50px rgba(0,0,0,0.08)',
    minHeight: '500px'
  },
  brand: {
    color: '#1f4d2e',
    fontWeight: '500'
  },
  heading: {
    margin: '10px 0',
    fontSize: '24px',
    fontWeight: '600',
    color: '#1a1a1a'
  },
  sub: {
    color: '#777',
    fontSize: '14px',
    marginBottom: '10px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginTop: '20px'
  },
  inputWrapper: {
    position: 'relative'
  },
  input: {
    width: '100%',
    padding: '11px 38px',
    borderRadius: '12px',
    border: '1px solid #ddd',
    fontSize: '14px',
    outline: 'none',
    transition: '0.2s ease'
  },
  icon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#999'
  },
  eyeBtn: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer'
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
    marginTop: '6px'
  },
  remember: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: '#555'
  },
  checkbox: {
    transform: 'scale(1.3)',
    cursor: 'pointer'
  },
  link: {
    color: '#1f7a3a',
    cursor: 'pointer'
  },
  linkStrong: {
    color: '#1f7a3a',
    fontWeight: '600',
    cursor: 'pointer'
  },
  button: {
    marginTop: '14px',
    padding: '12px',
    border: 'none',
    borderRadius: '25px',
    background: '#1f7a3a',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: '500',
    transition: '0.2s ease'
  },
  buttonHover: {
    background: '#186b31',
    boxShadow: '0 8px 24px rgba(31, 122, 58, 0.35)'
  },
  errorMessage: {
    padding: '10px 12px',
    marginBottom: '12px',
    borderRadius: '8px',
    background: '#fee',
    color: '#c33',
    fontSize: '13px',
    border: '1px solid #fcc'
  },
  switch: {
    marginTop: '24px',
    textAlign: 'center',
    fontSize: '14px',
    color: '#666'
  },
  image: {
  width: '360px',
  marginLeft: '29px',
  marginTop: '35px',
  borderRadius: '20px'
}
}