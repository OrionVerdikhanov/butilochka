import AsyncStorage from '@react-native-async-storage/async-storage';
import { Player } from '../../utils/storage';
import { PlayerRepository } from './interfaces';

const PLAYERS_KEY = '@butilochka_players';

/**
 * Реализация репозитория для работы с игроками
 */
export class PlayerRepositoryImpl implements PlayerRepository {
  /**
   * Сохранить список игроков
   */
  async savePlayers(players: Player[]): Promise<void> {
    try {
      const jsonValue = JSON.stringify(players);
      await AsyncStorage.setItem(PLAYERS_KEY, jsonValue);
    } catch (error) {
      console.error('Failed to save players:', error);
      throw new Error('Failed to save players');
    }
  }

  /**
   * Загрузить список игроков
   */
  async loadPlayers(): Promise<Player[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(PLAYERS_KEY);
      return jsonValue ? JSON.parse(jsonValue) : [];
    } catch (error) {
      console.error('Failed to load players:', error);
      return [];
    }
  }

  /**
   * Добавить нового игрока
   */
  async addPlayer(player: Player): Promise<void> {
    const players = await this.loadPlayers();

    // Проверяем, что игрок с таким ID не существует
    if (players.some(p => p.id === player.id)) {
      throw new Error(`Player with ID ${player.id} already exists`);
    }

    const updatedPlayers = [...players, player];
    await this.savePlayers(updatedPlayers);
  }

  /**
   * Обновить существующего игрока
   */
  async updatePlayer(playerId: string, updates: Partial<Player>): Promise<void> {
    const players = await this.loadPlayers();
    const playerIndex = players.findIndex(p => p.id === playerId);

    if (playerIndex === -1) {
      throw new Error(`Player with ID ${playerId} not found`);
    }

    const updatedPlayers = [...players];
    updatedPlayers[playerIndex] = { ...updatedPlayers[playerIndex], ...updates };
    await this.savePlayers(updatedPlayers);
  }

  /**
   * Удалить игрока
   */
  async removePlayer(playerId: string): Promise<void> {
    const players = await this.loadPlayers();
    const updatedPlayers = players.filter(p => p.id !== playerId);
    await this.savePlayers(updatedPlayers);
  }

  /**
   * Очистить всех игроков
   */
  async clearPlayers(): Promise<void> {
    try {
      await AsyncStorage.removeItem(PLAYERS_KEY);
    } catch (error) {
      console.error('Failed to clear players:', error);
      throw new Error('Failed to clear players');
    }
  }

  /**
   * Получить игрока по ID
   */
  async getPlayerById(playerId: string): Promise<Player | null> {
    try {
      const players = await this.loadPlayers();
      return players.find(p => p.id === playerId) || null;
    } catch (error) {
      console.error('Failed to get player by ID:', error);
      return null;
    }
  }

  /**
   * Проверить существование игрока
   */
  async playerExists(playerId: string): Promise<boolean> {
    try {
      const players = await this.loadPlayers();
      return players.some(p => p.id === playerId);
    } catch (error) {
      console.error('Failed to check player existence:', error);
      return false;
    }
  }
}