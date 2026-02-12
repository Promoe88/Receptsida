// ============================================
// Custom Hooks — Recipe search & autocomplete
// ============================================

import { useState, useRef, useCallback, useEffect } from 'react';
import { recipes, lexicon } from '../lib/api';

// ── useRecipeSearch ──
export function useRecipeSearch() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = useCallback(async (query, householdSize, preferences) => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const data = await recipes.search(query, householdSize, preferences);
      setResults(data);
      return data;
    } catch (err) {
      setError(err.message || 'Något gick fel vid sökningen.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResults(null);
    setError(null);
    setLoading(false);
  }, []);

  return { results, loading, error, search, reset };
}

// ── useAutocomplete ──
export function useAutocomplete(delay = 200) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef(null);

  const getSuggestions = useCallback(
    (input) => {
      // Clear previous timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Extract the last word being typed
      const parts = input.split(/[,;\s]+/);
      const lastWord = parts[parts.length - 1]?.trim();

      if (!lastWord || lastWord.length < 1) {
        setSuggestions([]);
        return;
      }

      timeoutRef.current = setTimeout(async () => {
        setLoading(true);
        try {
          const data = await lexicon.suggest(lastWord);
          setSuggestions(data.suggestions || []);
        } catch {
          setSuggestions([]);
        } finally {
          setLoading(false);
        }
      }, delay);
    },
    [delay]
  );

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return { suggestions, loading, getSuggestions, clearSuggestions };
}

// ── useFavorites ──
export function useFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadFavorites = useCallback(async () => {
    setLoading(true);
    try {
      const data = await recipes.favorites();
      setFavorites(data.favorites || []);
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleFavorite = useCallback(async (recipeId) => {
    try {
      const result = await recipes.toggleFavorite(recipeId);
      return result.saved;
    } catch {
      return null;
    }
  }, []);

  return { favorites, loading, loadFavorites, toggleFavorite };
}

// ── useSearchHistory ──
export function useSearchHistory() {
  const [history, setHistory] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadHistory = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const data = await recipes.history(page);
      setHistory(data.searches || []);
      setPagination(data.pagination);
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  return { history, pagination, loading, loadHistory };
}

// ── useCookingAssistant ──
export function useCookingAssistant(recipe) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const ask = useCallback(async (question, context = {}) => {
    if (!recipe || !question.trim()) return null;

    const userMsg = { role: 'user', content: question };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const data = await recipes.askCookingAssistant(
        { title: recipe.title, ingredients: recipe.ingredients, steps: recipe.steps, tips: recipe.tips },
        question,
        messages.slice(-6),
        context
      );
      const assistantMsg = { role: 'assistant', content: data.answer };
      setMessages((prev) => [...prev, assistantMsg]);
      return data.answer;
    } catch (err) {
      const errorMsg = { role: 'assistant', content: 'Kunde inte svara just nu. Försök igen.' };
      setMessages((prev) => [...prev, errorMsg]);
      return null;
    } finally {
      setLoading(false);
    }
  }, [recipe, messages]);

  const clearMessages = useCallback(() => setMessages([]), []);

  return { messages, loading, ask, clearMessages };
}

// ── useShoppingAssistant ──
export function useShoppingAssistant(recipe) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const ask = useCallback(async (question) => {
    if (!recipe || !question.trim()) return null;

    const userMsg = { role: 'user', content: question };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const data = await recipes.askShoppingAssistant(
        { title: recipe.title, ingredients: recipe.ingredients, steps: recipe.steps, tips: recipe.tips },
        question,
        messages.slice(-6)
      );
      const assistantMsg = { role: 'assistant', content: data.answer };
      setMessages((prev) => [...prev, assistantMsg]);
      return data.answer;
    } catch (err) {
      const errorMsg = { role: 'assistant', content: 'Kunde inte svara just nu. Försök igen.' };
      setMessages((prev) => [...prev, errorMsg]);
      return null;
    } finally {
      setLoading(false);
    }
  }, [recipe, messages]);

  const clearMessages = useCallback(() => setMessages([]), []);

  return { messages, loading, ask, clearMessages };
}
