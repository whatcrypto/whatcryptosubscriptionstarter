import { motion } from 'framer-motion'
import React from 'react'

// Allow me to also pass in all regular div props
const AnimateDown: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  // DEFINE ANIMATION VARIANT

  // USE ANIMATION VARIANT

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="show"
      viewport={{ once: true }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.15,
          },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

export const AnimateDownChild: React.FC<{
  children: React.ReactNode
  className?: string
  style?: any
}> = ({ children, className, style }) => {
  let FADE_DOWN_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: -6 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' } },
  }

  return (
    <motion.div style={style} variants={FADE_DOWN_ANIMATION_VARIANTS} className={className}>
      {children}
    </motion.div>
  )
}

export default AnimateDown
