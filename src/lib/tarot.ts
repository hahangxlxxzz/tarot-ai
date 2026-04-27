import { CARD_IMAGES } from './cardImages';

export interface TarotCard {
  id: string;
  name: { en: string; vi: string };
  suit?: 'Wands' | 'Cups' | 'Swords' | 'Pentacles';
  value: string;
  imageUrl: string;
  meaning: {
    upright: { en: string; vi: string };
    reversed: { en: string; vi: string };
  };
}

const MAJOR_ARCANA_DATA: Record<string, { en: string; vi: string; meanU: { en: string; vi: string }; meanR: { en: string; vi: string } }> = {
  "The Fool": { 
    en: "The Fool", vi: "Chàng Khờ", 
    meanU: { en: "Beginnings, innocence, spontaneity", vi: "Khởi đầu mới, sự ngây thơ, tính tự phát" },
    meanR: { en: "Recklessness, risk-taking, inconsideration", vi: "Sự liều lĩnh, mạo hiểm, thiếu cân nhắc" }
  },
  "The Magician": { 
    en: "The Magician", vi: "Nhà Ảo Thuật", 
    meanU: { en: "Manifestation, resourcefulness, power", vi: "Sự hiện lộ, tháo vát, quyền năng" },
    meanR: { en: "Manipulation, poor planning, untapped talents", vi: "Sự thao túng, lập kế hoạch kém, tài năng chưa khai phá" }
  },
  "The High Priestess": { 
    en: "The High Priestess", vi: "Nữ Tư Tế", 
    meanU: { en: "Intuition, sacred knowledge, divine feminine", vi: "Trực giác, tri thức thiêng liêng, năng lượng nữ tính" },
    meanR: { en: "Secrets, disconnected from intuition, withdrawal", vi: "Bí mật, mất kết nối với trực giác, sự rút lui" }
  },
  "The Empress": { 
    en: "The Empress", vi: "Nữ Hoàng", 
    meanU: { en: "Femininity, beauty, nature, nurturing", vi: "Sự nữ tính, vẻ đẹp, tự nhiên, sự nuôi dưỡng" },
    meanR: { en: "Creative block, dependence on others", vi: "Sự bế tắc sáng tạo, sự phụ thuộc vào người khác" }
  },
  "The Emperor": { 
    en: "The Emperor", vi: "Hoàng Đế", 
    meanU: { en: "Authority, establishment, structure", vi: "Quyền lực, sự thiết lập, cấu trúc" },
    meanR: { en: "Domination, excessive control, lack of discipline", vi: "Sự thống trị, kiểm soát quá mức, thiếu kỷ luật" }
  },
  "The Hierophant": { 
    en: "The Hierophant", vi: "Bậc Giáo Chủ", 
    meanU: { en: "Spiritual wisdom, religious beliefs, conformity", vi: "Trí tuệ tâm linh, niềm tin tôn giáo, sự tuân thủ" },
    meanR: { en: "Personal beliefs, freedom, challenging the status quo", vi: "Niềm tin cá nhân, tự do, thách thức hiện trạng" }
  },
  "The Lovers": { 
    en: "The Lovers", vi: "Những Người Yêu Nhau", 
    meanU: { en: "Love, harmony, relationships, values", vi: "Tình yêu, sự hòa hợp, mối quan hệ, giá trị" },
    meanR: { en: "Self-love, disharmony, imbalance, misalignment", vi: "Sự yêu bản thân, bất hòa, mất cân bằng, không liên kết" }
  },
  "The Chariot": { 
    en: "The Chariot", vi: "Cỗ Xe Chiến Thắng", 
    meanU: { en: "Control, will power, success, action", vi: "Sự kiểm soát, ý chí, thành công, hành động" },
    meanR: { en: "Self-discipline, opposition, lack of direction", vi: "Kỷ luật bản thân, sự phản kháng, thiếu định hướng" }
  },
  "Strength": { 
    en: "Strength", vi: "Sức Mạnh", 
    meanU: { en: "Strength, courage, persuasion, influence", vi: "Sức mạnh, lòng dũng cảm, sự thuyết phục, tầm ảnh hưởng" },
    meanR: { en: "Inner strength, self-doubt, low energy", vi: "Sức mạnh nội tâm, sự tự ti, năng lượng thấp" }
  },
  "The Hermit": { 
    en: "The Hermit", vi: "Ẩn Sĩ", 
    meanU: { en: "Soul-searching, introspection, being alone", vi: "Sự chiêm nghiệm, thấu hiểu bản thân, sự cô độc" },
    meanR: { en: "Isolation, loneliness, withdrawal", vi: "Sự cô lập, cô đơn, rút lui khỏi thế giới" }
  },
  "Wheel of Fortune": { 
    en: "Wheel of Fortune", vi: "Vòng Quay May Mắn", 
    meanU: { en: "Good luck, karma, life cycles, destiny", vi: "May mắn, nghiệp quả, chu kỳ cuộc sống, định mệnh" },
    meanR: { en: "Bad luck, resistance to change, breaking cycles", vi: "Vận xui, sự kháng cự với thay đổi, phá vỡ chu kỳ" }
  },
  "Justice": { 
    en: "Justice", vi: "Công Lý", 
    meanU: { en: "Justice, fairness, truth, cause and effect", vi: "Sự công bằng, lẽ phải, sự thật, nhân quả" },
    meanR: { en: "Unfairness, lack of accountability, dishonesty", vi: "Sự bất công, thiếu trách nhiệm, sự không trung thực" }
  },
  "The Hanged Man": { 
    en: "The Hanged Man", vi: "Người Treo", 
    meanU: { en: "Pause, surrender, letting go, new perspectives", vi: "Tạm dừng, buông bỏ, từ bỏ, góc nhìn mới" },
    meanR: { en: "Delays, resistance, stalling, indecision", vi: "Trì hoãn, sự kháng cự, chùn bước, thiếu quyết đoán" }
  },
  "Death": { 
    en: "Death", vi: "Cái Chết", 
    meanU: { en: "Endings, change, transformation, transition", vi: "Sự kết thúc, thay đổi, biến đổi, chuyển giao" },
    meanR: { en: "Resistance to change, personal transformation", vi: "Kháng cự thay đổi, sự biến đổi cá nhân tiềm ẩn" }
  },
  "Temperance": { 
    en: "Temperance", vi: "Sự Chừng Mực", 
    meanU: { en: "Balance, moderation, patience, purpose", vi: "Sự cân bằng, tiết chế, kiên nhẫn, mục đích" },
    meanR: { en: "Imbalance, excess, self-healing, re-alignment", vi: "Mất cân bằng, dư thừa, tự chữa lành, căn chỉnh lại" }
  },
  "The Devil": { 
    en: "The Devil", vi: "Ác Quỷ", 
    meanU: { en: "Shadow self, attachment, addiction, restriction", vi: "Phần tối, sự lệ thuộc, chứng nghiện, sự hạn chế" },
    meanR: { en: "Releasing limiting beliefs, detachment, freedom", vi: "Giải phóng niềm tin hạn hẹp, sự buông bỏ, tự do" }
  },
  "The Tower": { 
    en: "The Tower", vi: "Tòa Tháp", 
    meanU: { en: "Sudden change, upheaval, chaos, revelation", vi: "Thay đổi đột ngột, chấn động, hỗn loạn, sự mặc khải" },
    meanR: { en: "Personal transformation, fear of change, averting disaster", vi: "Biến đổi nội tâm, sợ thay đổi, ngăn chặn thảm họa" }
  },
  "The Star": { 
    en: "The Star", vi: "Ngôi Sao", 
    meanU: { en: "Hope, faith, purpose, renewal, spirituality", vi: "Hy vọng, niềm tin, mục đích, sự đổi mới, tâm linh" },
    meanR: { en: "Lack of faith, despair, self-trust, disconnection", vi: "Mất niềm tin, tuyệt vọng, sự tự tin, mất kết nối" }
  },
  "The Moon": { 
    en: "The Moon", vi: "Mặt Trăng", 
    meanU: { en: "Illusion, fear, anxiety, subconscious, intuition", vi: "Ảo giác, nỗi sợ, lo âu, tiềm thức, trực giác" },
    meanR: { en: "Release of fear, repressed emotion, confusion", vi: "Giải tỏa nỗi sợ, cảm xúc bị kìm nén, sự mơ hồ" }
  },
  "The Sun": { 
    en: "The Sun", vi: "Mặt Trời", 
    meanU: { en: "Positivity, fun, warmth, success, vitality", vi: "Tích cực, vui vẻ, ấm áp, thành công, sức sống" },
    meanR: { en: "Inner child, feeling down, overly optimistic", vi: "Đứa trẻ nội tâm, cảm thấy hụt hẫng, lạc quan quá mức" }
  },
  "Judgement": { 
    en: "Judgement", vi: "Sự Phán Xét", 
    meanU: { en: "Judgement, rebirth, inner calling, absolution", vi: "Sự đánh giá, tái sinh, tiếng gọi nội tâm, sự xá tội" },
    meanR: { en: "Self-doubt, inner critic, ignoring the call", vi: "Sự nghi ngờ bản thân, chỉ trích nội tâm, phớt lờ tiếng gọi" }
  },
  "The World": { 
    en: "The World", vi: "Thế Giới", 
    meanU: { en: "Completion, integration, accomplishment, travel", vi: "Sự hoàn thành, tích hợp, thành tựu, du hành" },
    meanR: { en: "Seeking closure, shortcuts, delays", vi: "Tìm kiếm sự kết thúc, lối tắt, sự trì hoãn" }
  }
};

const MAJOR_ARCANA = [
  "The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor",
  "The Hierophant", "The Lovers", "The Chariot", "Strength", "The Hermit",
  "Wheel of Fortune", "Justice", "The Hanged Man", "Death", "Temperance",
  "The Devil", "The Tower", "The Star", "The Moon", "The Sun",
  "Judgement", "The World"
];

const SUITS = ['Wands', 'Cups', 'Swords', 'Pentacles'] as const;
const MINOR_VALUES = ['Ace', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Page', 'Knight', 'Queen', 'King'];

export function generateDeck(): TarotCard[] {
  const deck: TarotCard[] = [];

  // Major Arcana images: m00.PNG to m21.PNG
  MAJOR_ARCANA.forEach((nameEn, i) => {
    const data = MAJOR_ARCANA_DATA[nameEn] || { 
      en: nameEn, vi: nameEn, 
      meanU: { en: "Guidance is manifesting...", vi: "Sự dẫn dắt đang hiện rõ..." },
      meanR: { en: "Review your path...", vi: "Hãy xem xét lại con đường của bạn..." }
    };
    const paddedIndex = i.toString().padStart(2, '0');
    const imageKey = `m${paddedIndex}`;
    deck.push({
      id: `major-${i}`,
      name: { en: data.en, vi: data.vi },
      value: nameEn,
      imageUrl: CARD_IMAGES[imageKey] || `/assets/cards/${imageKey}.PNG`,
      meaning: {
        upright: data.meanU,
        reversed: data.meanR
      }
    });
  });

  // Minor Arcana images
  const suitPrefixes: Record<string, string> = { 'Wands': 'w', 'Cups': 'c', 'Swords': 's', 'Pentacles': 'p' };
  const minorVietNamese: Record<string, string> = { 'Wands': 'Gậy', 'Cups': 'Ly', 'Swords': 'Kiếm', 'Pentacles': 'Tiền' };
  const valueVietNamese: Record<string, string> = {
    'Ace': 'Ace', 'Two': 'Hai', 'Three': 'Ba', 'Four': 'Bốn', 'Five': 'Năm', 
    'Six': 'Sáu', 'Seven': 'Bảy', 'Eight': 'Tám', 'Nine': 'Chín', 'Ten': 'Mười',
    'Page': 'Page', 'Knight': 'Knight', 'Queen': 'Queen', 'King': 'King'
  };

  const SUIT_MEANINGS: Record<string, { upright: { en: string; vi: string }; reversed: { en: string; vi: string } }> = {
    'Wands': { 
      upright: { en: "Energy, passion, and creativity", vi: "Năng lượng, đam mê và sự sáng tạo" },
      reversed: { en: "Burnout, lack of direction, or misdirected energy", vi: "Sự kiệt sức, thiếu định hướng hoặc năng lượng bị đặt sai chỗ" }
    },
    'Cups': { 
      upright: { en: "Emotions, relationships, and intuition", vi: "Cảm xúc, mối quan hệ và trực giác" },
      reversed: { en: "Emotional instability, blocked intuition, or relationship issues", vi: "Sự bất ổn cảm xúc, trực giác bị tắc nghẽn hoặc vấn đề quan hệ" }
    },
    'Swords': { 
      upright: { en: "Intellect, logic, and communication", vi: "Trí tuệ, logic và sự giao tiếp" },
      reversed: { en: "Confusion, lack of clarity, or mental conflict", vi: "Sự bối rối, thiếu minh bạch hoặc xung đột tinh thần" }
    },
    'Pentacles': { 
      upright: { en: "Material world, finances, and physical health", vi: "Thế giới vật chất, tài chính và sức khỏe thể chất" },
      reversed: { en: "Financial loss, greed, or lack of stability", vi: "Thất thoát tài chính, lòng tham hoặc thiếu sự ổn định" }
    }
  };

  const VALUE_MEANINGS: Record<string, { upright: string; reversed: string }> = {
    'Ace': { upright: "New potential", reversed: "Missed chance" },
    'Two': { upright: "Balance and choice", reversed: "Imbalance" },
    'Three': { upright: "Cooperation and growth", reversed: "Stagnation" },
    'Four': { upright: "Rest and stability", reversed: "Restlessness" },
    'Five': { upright: "Conflict and change", reversed: "Avoidance" },
    'Six': { upright: "Harmony and transition", reversed: "Stuck in the past" },
    'Seven': { upright: "Perseverance and effort", reversed: "Giving up" },
    'Eight': { upright: "Action and mastery", reversed: "Frustration" },
    'Nine': { upright: "Resilience and near completion", reversed: "Exhaustion" },
    'Ten': { upright: "Fullness and legacy", reversed: "Loss of fruit" },
    'Page': { upright: "Messenger and student", reversed: "Immaturity" },
    'Knight': { upright: "Action and focus", reversed: "Impulsiveness" },
    'Queen': { upright: "Nurturing and intuition", reversed: "Self-centered" },
    'King': { upright: "Mastery and leadership", reversed: "Tyranny" }
  };

  SUITS.forEach(suit => {
    MINOR_VALUES.forEach((val, i) => {
      const valNum = (i + 1).toString().padStart(2, '0');
      const imageKey = `${suitPrefixes[suit]}${valNum}`;
      const valMean = VALUE_MEANINGS[val];
      const suitMean = SUIT_MEANINGS[suit];
      
      deck.push({
        id: `${suit.toLowerCase()}-${val.toLowerCase()}`,
        name: { en: `${val} of ${suit}`, vi: `${valueVietNamese[val]} ${minorVietNamese[suit]}` },
        suit,
        value: val,
        imageUrl: CARD_IMAGES[imageKey] || `/assets/cards/${imageKey}.PNG`,
        meaning: {
          upright: { 
            en: `${valMean.upright}: ${suitMean.upright.en}`, 
            vi: `${valMean.upright}: ${suitMean.upright.vi}` 
          },
          reversed: { 
            en: `${valMean.reversed}: ${suitMean.reversed.en}`, 
            vi: `${valMean.reversed}: ${suitMean.reversed.vi}` 
          }
        }
      });
    });
  });

  return deck;
}

export function shuffleDeck(deck: TarotCard[]): TarotCard[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export interface ReadingCard extends TarotCard {
  isReversed: boolean;
  positionName: string;
}

export const SPREADS = {
  DAILY: {
    id: 'daily',
    name: "Standard Draw",
    nameVi: "Nghi Lễ Rút Bài",
    positions: ["Energy of the Moment"]
  },
  THREE_CARD: {
    id: 'three',
    name: "Three Card Journey",
    nameVi: "Hành Trình Ba Lá",
    positions: ["Past", "Present", "Future"]
  },
  CELTIC_CROSS: {
    id: 'celtic',
    name: "Celtic Cross",
    nameVi: "Trải Bài Celtic Cross",
    positions: [
      "Present", "Challenge", "Goal", "Foundation", "Recent Past", 
      "Near Future", "Internal Influence", "External Environment", 
      "Hopes & Fears", "Final Outcome"
    ]
  }
};
