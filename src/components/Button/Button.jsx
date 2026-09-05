import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './Button.css';

const Button = forwardRef(({
    children,
    variant = 'primary',
    size = 'md',
    icon,
    iconPosition = 'left',
    loading = false,
    disabled = false,
    fullWidth = false,
    to,
    href,
    className = '',
    ...props
}, ref) => {
    const classes = [
        'btn',
        `btn--${variant}`,
        `btn--${size}`,
        fullWidth && 'btn--full-width',
        loading && 'btn--loading',
        disabled && 'btn--disabled',
        className
    ].filter(Boolean).join(' ');

    const animationProps = {
        whileHover: { scale: disabled ? 1 : 1.02 },
        whileTap: { scale: disabled ? 1 : 0.98 },
        transition: { duration: 0.15 }
    };

    const content = (
        <>
            {loading && (
                <span className="btn__spinner">
                    <svg viewBox="0 0 24 24" className="animate-spin">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="31.4 31.4" />
                    </svg>
                </span>
            )}
            {icon && iconPosition === 'left' && !loading && (
                <span className="btn__icon btn__icon--left">{icon}</span>
            )}
            <span className="btn__text">{children}</span>
            {icon && iconPosition === 'right' && !loading && (
                <span className="btn__icon btn__icon--right">{icon}</span>
            )}
        </>
    );

    // If it's a hash link (anchor on same page)
    if (to && to.startsWith('#')) {
        return (
            <motion.a
                ref={ref}
                href={to}
                className={classes}
                {...animationProps}
                {...props}
            >
                {content}
            </motion.a>
        );
    }

    // If it's a Link component (internal navigation with React Router)
    if (to) {
        return (
            <motion.div {...animationProps} style={{ display: 'inline-block' }}>
                <Link
                    ref={ref}
                    to={to}
                    className={classes}
                    {...props}
                >
                    {content}
                </Link>
            </motion.div>
        );
    }

    // If it's an external link or anchor
    if (href) {
        return (
            <motion.a
                ref={ref}
                href={href}
                className={classes}
                {...animationProps}
                {...props}
            >
                {content}
            </motion.a>
        );
    }

    // Regular button
    return (
        <motion.button
            ref={ref}
            className={classes}
            disabled={disabled || loading}
            {...animationProps}
            {...props}
        >
            {content}
        </motion.button>
    );
});

Button.displayName = 'Button';

export default Button;
