import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { getLocalizedText } from '../../utils/helpers';
import './Timeline.css';

const Timeline = ({ items, variant = 'default' }) => {
    const { i18n } = useTranslation();
    const language = i18n.language;

    return (
        <div className={`timeline timeline--${variant}`}>
            {items.map((item, index) => (
                <motion.div
                    key={item.id || index}
                    className={`timeline__item ${item.current ? 'timeline__item--current' : ''} ${item.isEducation ? 'timeline__item--education' : ''}`}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                    {/* Connector */}
                    <div className="timeline__connector">
                        <div className="timeline__dot" />
                        {index < items.length - 1 && <div className="timeline__line" />}
                    </div>

                    {/* Content */}
                    <div className="timeline__content">
                        <div className="timeline__header">
                            <div className="timeline__info">
                                <h4 className="timeline__title">
                                    {getLocalizedText(item.title, language)}
                                </h4>
                                <p className="timeline__company">{item.company}</p>
                            </div>
                            <span className={`timeline__period ${item.current ? 'timeline__period--current' : ''}`}>
                                {getLocalizedText(item.period, language)}
                            </span>
                        </div>
                        {item.description && (
                            <p className="timeline__description">
                                {getLocalizedText(item.description, language)}
                            </p>
                        )}
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

// Case Study Timeline variant
export const CaseStudyTimeline = ({ steps }) => {
    const { i18n } = useTranslation();
    const language = i18n.language;

    const icons = {
        problem: '🔍',
        solution: '💡',
        result: '🎯'
    };

    const colors = {
        problem: { bg: '#fee2e2', border: '#ef4444' },
        solution: { bg: '#dbeafe', border: '#2563eb' },
        result: { bg: '#d1fae5', border: '#10b981' }
    };

    return (
        <div className="case-timeline">
            {steps.map((step, index) => (
                <motion.div
                    key={step.type}
                    className="case-timeline__item"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.15 }}
                >
                    {/* Icon */}
                    <div
                        className="case-timeline__icon"
                        style={{
                            backgroundColor: colors[step.type].bg,
                            borderColor: colors[step.type].border
                        }}
                    >
                        {icons[step.type]}
                    </div>

                    {/* Content */}
                    <div className="case-timeline__content">
                        <h4 className="case-timeline__title">{step.title}</h4>
                        <p className="case-timeline__text">
                            {getLocalizedText(step.content, language)}
                        </p>
                    </div>

                    {/* Connector */}
                    {index < steps.length - 1 && (
                        <div className="case-timeline__connector">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M12 5v14M19 12l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    )}
                </motion.div>
            ))}
        </div>
    );
};

export default Timeline;
