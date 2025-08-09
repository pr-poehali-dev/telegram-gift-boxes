import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

interface GiftBox {
  id: number;
  name: string;
  price: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'daily';
  image: string;
  description: string;
  isDaily?: boolean;
  minReward?: number;
  maxReward?: number;
  cooldownHours?: number;
}

interface PlayerStats {
  totalSpent: number;
  totalWins: number;
  bestWin: string;
  winRate: number;
  favoriteBox: string;
  level: number;
  experience: number;
  nextLevelExp: number;
  currentStars: number;
  dailyBoxLastOpened: string | null;
}

const Index = () => {
  const [selectedBox, setSelectedBox] = useState<number | null>(null);
  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    totalSpent: 2450,
    totalWins: 127,
    bestWin: 'Космический скин',
    winRate: 68,
    favoriteBox: 'Киберпанк бокс',
    level: 15,
    experience: 3420,
    nextLevelExp: 4000,
    currentStars: 85,
    dailyBoxLastOpened: localStorage.getItem('dailyBoxLastOpened')
  });
  const [timeUntilNextDaily, setTimeUntilNextDaily] = useState<string>('');

  const giftBoxes: GiftBox[] = [
    {
      id: 0,
      name: 'Дневной бонус',
      price: 1,
      rarity: 'daily',
      image: '/img/0950a1a2-c10d-41fe-aa33-3dc1d9711658.jpg',
      description: 'Ежедневная награда: от 2 до 10 звезд',
      isDaily: true,
      minReward: 2,
      maxReward: 10,
      cooldownHours: 24
    },
    {
      id: 1,
      name: 'Стартовый бокс',
      price: 10,
      rarity: 'common',
      image: '/img/9bdeb094-2c26-4a77-abf0-e0ce95d34df0.jpg',
      description: 'Идеальный выбор для начинающих космонавтов'
    },
    {
      id: 2,
      name: 'Киберпанк бокс',
      price: 50,
      rarity: 'rare',
      image: '/img/92d340cd-2886-43a9-afae-05dc7df7b25d.jpg',
      description: 'Футуристические награды из мегаполиса будущего'
    },
    {
      id: 3,
      name: 'Легендарный бокс',
      price: 200,
      rarity: 'legendary',
      image: '/img/1c5d0183-c469-4220-b6d6-b2c1f14e231e.jpg',
      description: 'Эксклюзивные награды для элитных игроков'
    }
  ];

  const leaderboard = [
    { rank: 1, name: 'AstroCommander', stars: 15420, avatar: '👨‍🚀' },
    { rank: 2, name: 'StarCrusher', stars: 12890, avatar: '🚀' },
    { rank: 3, name: 'NeonHunter', stars: 9760, avatar: '⭐' },
    { rank: 4, name: 'CyberPilot', stars: 8340, avatar: '🤖' },
    { rank: 5, name: 'GalaxyMaster', stars: 7120, avatar: '🌌' }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'daily': return 'text-neon-green border-neon-green';
      case 'common': return 'text-neon-cyan border-neon-cyan';
      case 'rare': return 'text-neon-pink border-neon-pink';
      case 'epic': return 'text-neon-purple border-neon-purple';
      case 'legendary': return 'text-neon-yellow border-neon-yellow';
      default: return 'text-neon-cyan border-neon-cyan';
    }
  };

  const getRarityBg = (rarity: string) => {
    switch (rarity) {
      case 'daily': return 'from-neon-green/20 to-neon-green/5';
      case 'common': return 'from-neon-cyan/20 to-neon-cyan/5';
      case 'rare': return 'from-neon-pink/20 to-neon-pink/5';
      case 'epic': return 'from-neon-purple/20 to-neon-purple/5';
      case 'legendary': return 'from-neon-yellow/20 to-neon-yellow/5';
      default: return 'from-neon-cyan/20 to-neon-cyan/5';
    }
  };

  const canOpenDailyBox = () => {
    if (!playerStats.dailyBoxLastOpened) return true;
    const lastOpened = new Date(playerStats.dailyBoxLastOpened);
    const now = new Date();
    const timeDiff = now.getTime() - lastOpened.getTime();
    return timeDiff >= 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  };

  const getTimeUntilNextDaily = () => {
    if (!playerStats.dailyBoxLastOpened) return '';
    const lastOpened = new Date(playerStats.dailyBoxLastOpened);
    const nextAvailable = new Date(lastOpened.getTime() + 24 * 60 * 60 * 1000);
    const now = new Date();
    const timeDiff = nextAvailable.getTime() - now.getTime();
    
    if (timeDiff <= 0) return '';
    
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}ч ${minutes}м`;
  };

  const handleBoxOpen = (box: GiftBox) => {
    if (box.isDaily) {
      if (!canOpenDailyBox()) return;
      
      // Generate random reward
      const reward = Math.floor(Math.random() * (box.maxReward! - box.minReward! + 1)) + box.minReward!;
      
      // Update player stats
      setPlayerStats(prev => ({
        ...prev,
        currentStars: prev.currentStars + reward - 1, // -1 for box cost
        totalWins: prev.totalWins + 1,
        dailyBoxLastOpened: new Date().toISOString()
      }));
      
      // Save to localStorage
      localStorage.setItem('dailyBoxLastOpened', new Date().toISOString());
      
      alert(`Поздравляем! Вы получили ${reward} звезд! ⭐`);
    } else {
      // Handle regular box opening
      if (playerStats.currentStars < box.price) {
        alert('Недостаточно звезд!');
        return;
      }
      
      setPlayerStats(prev => ({
        ...prev,
        currentStars: prev.currentStars - box.price,
        totalSpent: prev.totalSpent + box.price,
        totalWins: prev.totalWins + 1
      }));
      
      alert(`Бокс "${box.name}" открыт! 🎁`);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeUntilNextDaily(getTimeUntilNextDaily());
    }, 60000); // Update every minute
    
    // Initial update
    setTimeUntilNextDaily(getTimeUntilNextDaily());
    
    return () => clearInterval(interval);
  }, [playerStats.dailyBoxLastOpened]);

  return (
    <div className="min-h-screen bg-gaming-dark text-foreground dark">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gaming-dark-card/80 backdrop-blur border-b border-neon-cyan/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Icon name="Gift" className="text-neon-cyan" size={32} />
            <h1 className="text-2xl font-bold neon-text text-neon-cyan">GIFT BOXES</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Icon name="Star" className="text-neon-yellow" size={20} />
              <span className="font-semibold">{playerStats.currentStars}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="User" className="text-neon-pink" size={20} />
              <span>LVL {playerStats.level}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h2 className="text-5xl font-bold mb-4 neon-text text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-neon-pink to-neon-purple animate-float">
            Открывай. Выигрывай. Покоряй космос! 🚀
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Выбери свой путь среди звезд и открой уникальные награды в наших космических боксах
          </p>
        </section>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Gift Boxes */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-3xl font-bold text-neon-cyan neon-text">Каталог боксов</h3>
              <Button variant="outline" className="border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-gaming-dark">
                <Icon name="Filter" size={16} className="mr-2" />
                Фильтры
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {giftBoxes.map((box) => (
                <Card 
                  key={box.id}
                  className={`neon-box bg-gradient-to-br ${getRarityBg(box.rarity)} border-2 ${getRarityColor(box.rarity)} cursor-pointer transition-all duration-300 ${selectedBox === box.id ? 'ring-2 ring-neon-yellow' : ''}`}
                  onClick={() => setSelectedBox(box.id)}
                >
                  <CardContent className="p-6">
                    <div className="aspect-square mb-4 overflow-hidden rounded-lg">
                      <img 
                        src={box.image} 
                        alt={box.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      />
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-lg">{box.name}</h4>
                        <Badge className={`${getRarityColor(box.rarity)} bg-transparent border`}>
                          {box.rarity === 'daily' ? 'ЕЖЕДНЕВНЫЙ' : box.rarity.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{box.description}</p>
                      <div className="flex justify-between items-center pt-3">
                        <div className="flex items-center space-x-1">
                          <Icon name="Star" className="text-neon-yellow" size={16} />
                          <span className="font-semibold text-neon-yellow">
                            {box.isDaily ? `${box.price} → ${box.minReward}-${box.maxReward}` : box.price}
                          </span>
                        </div>
                        <Button 
                          className={`${box.isDaily 
                            ? (canOpenDailyBox() 
                              ? 'bg-gradient-to-r from-neon-green to-neon-cyan hover:from-neon-cyan hover:to-neon-green' 
                              : 'bg-gray-600 cursor-not-allowed opacity-50'
                            ) 
                            : (playerStats.currentStars >= box.price
                              ? 'bg-gradient-to-r from-neon-cyan to-neon-purple hover:from-neon-purple hover:to-neon-pink'
                              : 'bg-gray-600 cursor-not-allowed opacity-50'
                            )
                          } text-gaming-dark font-semibold`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (box.isDaily && !canOpenDailyBox()) return;
                            if (!box.isDaily && playerStats.currentStars < box.price) return;
                            handleBoxOpen(box);
                          }}
                          disabled={box.isDaily ? !canOpenDailyBox() : playerStats.currentStars < box.price}
                        >
                          {box.isDaily && !canOpenDailyBox() ? timeUntilNextDaily : 'Открыть'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Rules Section */}
            <Card className="bg-gaming-dark-card border-neon-purple/30">
              <CardContent className="p-6">
                <h4 className="text-xl font-bold mb-4 text-neon-purple neon-text flex items-center">
                  <Icon name="Book" className="mr-2" size={24} />
                  Правила игры
                </h4>
                <div className="space-y-2 text-muted-foreground">
                  <p>• Покупайте боксы за звезды Telegram</p>
                  <p>• Каждый бокс содержит случайные награды</p>
                  <p>• Чем дороже бокс, тем выше шанс редких предметов</p>
                  <p>• Собирайте коллекции и повышайте уровень</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Player Stats */}
            <Card className="bg-gaming-dark-card border-neon-cyan/30">
              <CardContent className="p-6">
                <h4 className="text-xl font-bold mb-4 text-neon-cyan neon-text flex items-center">
                  <Icon name="User" className="mr-2" size={24} />
                  Статистика
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Уровень:</span>
                    <span className="font-semibold text-neon-yellow">{playerStats.level}</span>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-muted-foreground">Опыт:</span>
                      <span className="text-sm">{playerStats.experience}/{playerStats.nextLevelExp}</span>
                    </div>
                    <Progress value={(playerStats.experience / playerStats.nextLevelExp) * 100} className="h-2" />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Потрачено звезд:</span>
                    <span className="font-semibold text-neon-yellow">{playerStats.totalSpent}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Выигрышей:</span>
                    <span className="font-semibold text-neon-green">{playerStats.totalWins}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Винрейт:</span>
                    <span className="font-semibold text-neon-pink">{playerStats.winRate}%</span>
                  </div>
                  <div className="pt-2 border-t border-border">
                    <div className="text-sm text-muted-foreground mb-1">Лучший выигрыш:</div>
                    <div className="font-semibold text-neon-purple">{playerStats.bestWin}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Leaderboard */}
            <Card className="bg-gaming-dark-card border-neon-pink/30">
              <CardContent className="p-6">
                <h4 className="text-xl font-bold mb-4 text-neon-pink neon-text flex items-center">
                  <Icon name="Trophy" className="mr-2" size={24} />
                  Рейтинг
                </h4>
                <div className="space-y-3">
                  {leaderboard.map((player) => (
                    <div key={player.rank} className="flex items-center justify-between p-2 rounded-lg bg-gaming-dark/50">
                      <div className="flex items-center space-x-3">
                        <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
                          player.rank === 1 ? 'bg-neon-yellow text-gaming-dark' : 
                          player.rank === 2 ? 'bg-gray-400 text-gaming-dark' : 
                          player.rank === 3 ? 'bg-amber-600 text-gaming-dark' : 
                          'bg-gaming-gray-700 text-white'
                        }`}>
                          {player.rank}
                        </span>
                        <span className="text-2xl">{player.avatar}</span>
                        <span className="font-medium">{player.name}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Icon name="Star" className="text-neon-yellow" size={14} />
                        <span className="font-semibold text-sm">{player.stars.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Support */}
            <Card className="bg-gaming-dark-card border-neon-green/30">
              <CardContent className="p-6">
                <h4 className="text-xl font-bold mb-4 text-neon-green neon-text flex items-center">
                  <Icon name="MessageCircle" className="mr-2" size={24} />
                  Поддержка
                </h4>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full border-neon-green text-neon-green hover:bg-neon-green hover:text-gaming-dark">
                    <Icon name="Send" size={16} className="mr-2" />
                    Написать в Telegram
                  </Button>
                  <Button variant="outline" className="w-full border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-gaming-dark">
                    <Icon name="HelpCircle" size={16} className="mr-2" />
                    FAQ
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;