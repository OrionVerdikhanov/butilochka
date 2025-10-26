import { useState, useEffect, useCallback } from 'react';
import { Player } from '../types';
import { savePlayers, loadPlayers } from '../utils/storage';

/**
 * Возвращаемое значение хука usePlayers
 */
export interface UsePlayersReturn {
  /** Массив игроков */
  players: Player[];
  /** Функция добавления игрока */
  addPlayer: (player: Player) => Promise<void>;
  /** Функция добавления нескольких игроков */
  addPlayers: (newPlayers: Player[]) => Promise<void>;
  /** Функция удаления игрока */
  removePlayer: (playerId: string) => Promise<void>;
  /** Функция обновления игрока */
  updatePlayer: (playerId: string, updates: Partial<Player>) => Promise<void>;
  /** Функция очистки всех игроков */
  clearPlayers: () => Promise<void>;
  /** Функция перезагрузки игроков из хранилища */
  reloadPlayers: () => Promise<void>;
  /** Проверка существует ли игрок */
  playerExists: (playerId: string) => boolean;
  /** Получение игрока по ID */
  getPlayerById: (playerId: string) => Player | undefined;
  /** Количество игроков */
  playersCount: number;
  /** Происходит ли сохранение игроков */
  isSaving: boolean;
  /** Происходит ли загрузка игроков */
  isLoading: boolean;
}

/**
 * Кастомный хук для управления списком игроков
 *
 * @param initialPlayers - Начальный список игроков (опционально)
 * @returns Объект с игроками и функциями управления
 *
 * @example
 * ```typescript
 * const {
 *   players,
 *   addPlayer,
 *   removePlayer,
 *   updatePlayer,
 *   playersCount,
 *   isLoading
 * } = usePlayers();
 *
 * // Добавление игрока
 * await addPlayer({
 *   id: '1',
 *   name: 'John',
 *   gender: 'M'
 * });
 *
 * // Обновление игрока
 * await updatePlayer('1', { name: 'John Doe' });
 *
 * // Удаление игрока
 * await removePlayer('1');
 * ```
 */
export function usePlayers(initialPlayers?: Player[]): UsePlayersReturn {
  const [players, setPlayers] = useState<Player[]>(initialPlayers || []);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Загрузка игроков из хранилища
   */
  const loadPlayersFromStorage = useCallback(async () => {
    try {
      setIsLoading(true);
      const savedPlayers = await loadPlayers();
      setPlayers(savedPlayers);
    } catch (error) {
      console.error('Failed to load players:', error);
      setPlayers([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Сохранение игроков в хранилище
   */
  const savePlayersToStorage = useCallback(async (playersList: Player[]) => {
    try {
      setIsSaving(true);
      await savePlayers(playersList);
      setPlayers(playersList);
    } catch (error) {
      console.error('Failed to save players:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, []);

  /**
   * Добавление игрока
   */
  const addPlayer = useCallback(async (player: Player) => {
    // Проверяем, что игрок с таким ID еще не существует
    if (players.some(p => p.id === player.id)) {
      throw new Error(`Player with ID ${player.id} already exists`);
    }

    const updatedPlayers = [...players, player];
    await savePlayersToStorage(updatedPlayers);
  }, [players, savePlayersToStorage]);

  /**
   * Добавление нескольких игроков
   */
  const addPlayers = useCallback(async (newPlayers: Player[]) => {
    // Фильтруем дубликаты
    const uniqueNewPlayers = newPlayers.filter(
      newPlayer => !players.some(p => p.id === newPlayer.id)
    );

    if (uniqueNewPlayers.length !== newPlayers.length) {
      console.warn('Some players were not added due to duplicate IDs');
    }

    const updatedPlayers = [...players, ...uniqueNewPlayers];
    await savePlayersToStorage(updatedPlayers);
  }, [players, savePlayersToStorage]);

  /**
   * Удаление игрока
   */
  const removePlayer = useCallback(async (playerId: string) => {
    const updatedPlayers = players.filter(p => p.id !== playerId);
    await savePlayersToStorage(updatedPlayers);
  }, [players, savePlayersToStorage]);

  /**
   * Обновление игрока
   */
  const updatePlayer = useCallback(async (playerId: string, updates: Partial<Player>) => {
    const updatedPlayers = players.map(player =>
      player.id === playerId ? { ...player, ...updates } : player
    );

    // Проверяем, что игрок существовал
    const playerExists = players.some(p => p.id === playerId);
    if (!playerExists) {
      throw new Error(`Player with ID ${playerId} not found`);
    }

    await savePlayersToStorage(updatedPlayers);
  }, [players, savePlayersToStorage]);

  /**
   * Очистка всех игроков
   */
  const clearPlayers = useCallback(async () => {
    await savePlayersToStorage([]);
  }, [savePlayersToStorage]);

  /**
   * Перезагрузка игроков из хранилища
   */
  const reloadPlayers = useCallback(async () => {
    await loadPlayersFromStorage();
  }, [loadPlayersFromStorage]);

  /**
   * Проверка существует ли игрок
   */
  const playerExists = useCallback((playerId: string) => {
    return players.some(p => p.id === playerId);
  }, [players]);

  /**
   * Получение игрока по ID
   */
  const getPlayerById = useCallback((playerId: string) => {
    return players.find(p => p.id === playerId);
  }, [players]);

  // Загружаем игроков при монтировании компонента
  useEffect(() => {
    if (!initialPlayers) {
      loadPlayersFromStorage();
    } else {
      setIsLoading(false);
    }
  }, [initialPlayers, loadPlayersFromStorage]);

  return {
    players,
    addPlayer,
    addPlayers,
    removePlayer,
    updatePlayer,
    clearPlayers,
    reloadPlayers,
    playerExists,
    getPlayerById,
    playersCount: players.length,
    isSaving,
    isLoading,
  };
}