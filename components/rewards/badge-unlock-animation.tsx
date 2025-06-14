import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Star, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  pointsRequired: number;
  category: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface BadgeUnlockAnimationProps {
  achievement: Achievement | null;
  isVisible: boolean;
  onClose: () => void;
}

const rarityStyles = {
  common: {
    gradient: "from-gray-400 to-gray-600",
    glow: "shadow-gray-400/50",
    particles: "#9CA3AF"
  },
  rare: {
    gradient: "from-blue-400 to-blue-600",
    glow: "shadow-blue-400/50",
    particles: "#3B82F6"
  },
  epic: {
    gradient: "from-purple-400 to-purple-600",
    glow: "shadow-purple-400/50",
    particles: "#8B5CF6"
  },
  legendary: {
    gradient: "from-yellow-400 to-orange-500",
    glow: "shadow-yellow-400/50",
    particles: "#F59E0B"
  }
};

const ParticleEffect = ({ color, show }: { color: string; show: boolean }) => {
  if (!show) return null;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{ backgroundColor: color }}
          initial={{ 
            opacity: 0,
            scale: 0,
            x: "50%",
            y: "50%"
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            x: ["50%", `${50 + (Math.random() - 0.5) * 200}%`],
            y: ["50%", `${50 + (Math.random() - 0.5) * 200}%`],
          }}
          transition={{
            duration: 2,
            delay: i * 0.1,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  );
};

export function BadgeUnlockAnimation({ achievement, isVisible, onClose }: BadgeUnlockAnimationProps) {
  const [showParticles, setShowParticles] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<'entrance' | 'celebration' | 'stable'>('entrance');

  useEffect(() => {
    if (isVisible && achievement) {
      setAnimationPhase('entrance');
      
      // Start particle effect after badge appears
      const particleTimer = setTimeout(() => {
        setShowParticles(true);
        setAnimationPhase('celebration');
      }, 800);

      // Stabilize animation
      const stabilizeTimer = setTimeout(() => {
        setAnimationPhase('stable');
        setShowParticles(false);
      }, 3000);

      // Auto-close after 6 seconds
      const autoCloseTimer = setTimeout(() => {
        onClose();
      }, 6000);

      return () => {
        clearTimeout(particleTimer);
        clearTimeout(stabilizeTimer);
        clearTimeout(autoCloseTimer);
      };
    }
  }, [isVisible, achievement, onClose]);

  if (!achievement || !isVisible) return null;

  const styles = rarityStyles[achievement.rarity];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0, rotate: -180, opacity: 0 }}
          animate={{ 
            scale: animationPhase === 'entrance' ? [0, 1.2, 1] : 1,
            rotate: animationPhase === 'entrance' ? [180, 0] : 0,
            opacity: 1,
            y: animationPhase === 'celebration' ? [0, -10, 0] : 0
          }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ 
            duration: animationPhase === 'entrance' ? 1.2 : 0.5,
            ease: "easeOut",
            repeat: animationPhase === 'celebration' ? 3 : 0,
            repeatType: "reverse"
          }}
          className={`relative bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl ${styles.glow}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Particle Effects */}
          <ParticleEffect color={styles.particles} show={showParticles} />

          {/* Close Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-4 right-4 h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="h-6 w-6 text-yellow-500" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                إنجاز جديد!
              </h2>
              <Sparkles className="h-6 w-6 text-yellow-500" />
            </div>
            <Badge 
              className={`bg-gradient-to-r ${styles.gradient} text-white font-medium px-3 py-1`}
            >
              {achievement.rarity === 'common' && 'عادي'}
              {achievement.rarity === 'rare' && 'نادر'}
              {achievement.rarity === 'epic' && 'ملحمي'}
              {achievement.rarity === 'legendary' && 'أسطوري'}
            </Badge>
          </motion.div>

          {/* Achievement Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ 
              scale: animationPhase === 'entrance' ? [0, 1.3, 1] : 1,
              rotate: animationPhase === 'celebration' ? [0, 360] : 0
            }}
            transition={{ 
              duration: 1,
              delay: 0.5,
              ease: "easeOut"
            }}
            className={`relative w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br ${styles.gradient} flex items-center justify-center shadow-xl ${styles.glow}`}
          >
            {/* Rotating Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border-4 border-dashed border-white/30"
            />
            
            {/* Achievement Icon */}
            <div className="text-6xl z-10">
              {achievement.icon}
            </div>

            {/* Inner Glow */}
            <div className="absolute inset-2 rounded-full bg-white/20 blur-sm" />
          </motion.div>

          {/* Achievement Details */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {achievement.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {achievement.description}
            </p>
            
            {/* Points Reward */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
              className="flex items-center justify-center gap-2 bg-green-100 dark:bg-green-900/20 rounded-lg p-3"
            >
              <Star className="h-5 w-5 text-yellow-500" />
              <span className="font-bold text-green-700 dark:text-green-300">
                +{achievement.pointsRequired} نقطة مكافآت!
              </span>
            </motion.div>
          </motion.div>

          {/* Action Button */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="mt-6"
          >
            <Button
              onClick={onClose}
              className={`bg-gradient-to-r ${styles.gradient} hover:opacity-90 text-white px-8 py-2 rounded-lg font-medium transition-all`}
            >
              <Trophy className="h-4 w-4 mr-2" />
              رائع!
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}