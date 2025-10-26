import { Player, Settings, GameStats } from '../../utils/storage';

/**
 * Интерфейс репозитория для работы с игроками
 */
export interface PlayerRepository {
  /**
   * Сохранить список игроков
   */
  savePlayers(players: Player[]): Promise<void>;

  /**
   * Загрузить список игроков
   */
  loadPlayers(): Promise<Player[]>;

  /**
   * Добавить нового игрока
   */
  addPlayer(player: Player): Promise<void>;

  /**
   * Обновить существующего игрока
   */
  updatePlayer(playerId: string, updates: Partial<Player>): Promise<void>;

  /**
   * Удалить игрока
   */
  removePlayer(playerId: string): Promise<void>;

  /**
   * Очистить всех игроков
   */
  clearPlayers(): Promise<void>;

  /**
   * Получить игрока по ID
   */
  getPlayerById(playerId: string): Promise<Player | null>;

  /**
   * Проверить существование игрока
   */
  playerExists(playerId: string): Promise<boolean>;
}

/**
 * Интерфейс репозитория для работы с настройками
 */
export interface SettingsRepository {
  /**
   * Сохранить настройки
   */
  saveSettings(settings: Settings): Promise<void>;

  /**
   * Загрузить настройки
   */
  loadSettings(): Promise<Settings>;

  /**
   * Сбросить настройки к значениям по умолчанию
   */
  resetSettings(): Promise<void>;

  /**
   * Обновить отдельные настройки
   */
  updateSettings(updates: Partial<Settings>): Promise<void>;
}

/**
 * Интерфейс репозитория для работы со статистикой
 */
export interface StatsRepository {
  /**
   * Сохранить статистику
   */
  saveStats(stats: GameStats): Promise<void>;

  /**
   * Загрузить статистику
   */
  loadStats(): Promise<GameStats>;

  /**
   * Обновить статистику игрока
   */
  updatePlayerStats(playerId: string, updates: {
    spins?: number;
    targets?: number;
    likes?: number;
  }): Promise<void>;

  /**
   * Увеличить счетчик общих игр
   */
  incrementTotalGames(): Promise<void>;

  /**
   * Увеличить счетчик вращений
   */
  incrementTotalSpins(): Promise<void>;

  /**
   * Сбросить статистику
   */
  resetStats(): Promise<void>;
}

/**
 * Интерфейс репозитория для работы с желаниями
 */
export interface WishesRepository {
  /**
   * Сохранить пользовательские желания
   */
  saveCustomWishes(wishes: string[]): Promise<void>;

  /**
   * Загрузить пользовательские желания
   */
  loadCustomWishes(): Promise<string[]>;

  /**
   * Добавить новое желание
   */
  addCustomWish(wish: string): Promise<void>;

  /**
   * Удалить желание
   */
  removeCustomWish(index: number): Promise<void>;

  /**
   * Очистить все пользовательские желания
   */
  clearCustomWishes(): Promise<void>;
}

/**
 * Интерфейс для управления всеми данными приложения
 */
export interface AppRepository {
  players: PlayerRepository;
  settings: SettingsRepository;
  stats: StatsRepository;
  wishes: WishesRepository;

  /**
   * Очистить все данные приложения
   */
  clearAllData(): Promise<void>;
}