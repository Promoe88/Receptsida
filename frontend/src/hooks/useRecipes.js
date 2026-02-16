// ============================================
// Custom Hooks — Recipe search & autocomplete
// ============================================

import { useState, useRef, useCallback, useEffect } from 'react';
import { recipes, lexicon, mealPlans } from '../lib/api';

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
      const code = err.code || 'unknown';
      const message = err.message || 'Något gick fel vid sökningen.';
      setError({ message, code });
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

// ── useMealPlan ──
export function useMealPlan() {
  const [plans, setPlans] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [shoppingList, setShoppingList] = useState([]);
  const [weeklyTip, setWeeklyTip] = useState('');
  const [totalCost, setTotalCost] = useState('');
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);

  const loadPlans = useCallback(async () => {
    setLoading(true);
    try {
      const data = await mealPlans.list();
      setPlans(data.plans || []);
      if (data.plans?.length > 0) {
        setCurrentPlan(data.plans[0]);
      }
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  const generate = useCallback(async (weekStart, householdSize, preferences) => {
    setGenerating(true);
    setError(null);
    try {
      const data = await mealPlans.generate(weekStart, householdSize, preferences);
      setCurrentPlan(data.plan);
      setShoppingList(data.shopping_list || []);
      setWeeklyTip(data.weekly_tip || '');
      setTotalCost(data.total_estimated_cost || '');
      loadPlans();
      return data;
    } catch (err) {
      setError(err.message || 'Kunde inte generera veckomenyn.');
      throw err;
    } finally {
      setGenerating(false);
    }
  }, [loadPlans]);

  const swapMeal = useCallback(async (dayIndex, mealType) => {
    if (!currentPlan) return;
    try {
      const data = await mealPlans.swap(currentPlan.id, dayIndex, mealType);
      setCurrentPlan(data.plan);
    } catch (err) {
      setError(err.message || 'Kunde inte byta rätt.');
    }
  }, [currentPlan]);

  const toggleLock = useCallback(async (mealId, locked) => {
    if (!currentPlan) return;
    try {
      await mealPlans.lockMeal(currentPlan.id, mealId, locked);
      setCurrentPlan((prev) => ({
        ...prev,
        meals: prev.meals.map((m) =>
          m.id === mealId ? { ...m, locked } : m
        ),
      }));
    } catch {
      // Silently fail
    }
  }, [currentPlan]);

  const selectPlan = useCallback(async (planId) => {
    setLoading(true);
    try {
      const data = await mealPlans.get(planId);
      setCurrentPlan(data.plan);
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    plans, currentPlan, shoppingList, weeklyTip, totalCost,
    loading, generating, error,
    loadPlans, generate, swapMeal, toggleLock, selectPlan,
  };
}
