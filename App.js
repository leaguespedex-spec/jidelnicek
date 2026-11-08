
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  Alert,
  StatusBar,
} from 'react-native';
import importedRecipes from './recepty_import.json';
import { createClient } from '@supabase/supabase-js';
const SUPABASE_URL = 'https://kacjobpidcolobxvrvso.supabase.co';
const SUPABASE_KEY = 'sb_publishable_lh1-EaH6tjoOTX5clGRcMg_rBz6gaMh';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
const initialRecipes = [
  {
    id: '1',
    name: 'Kuřecí maso s rýží',
    category: 'Oběd',
    portions: 1,
    ingredients: [
      { name: 'Kuřecí prsa', amount: '150', unit: 'g' },
      { name: 'Rýže', amount: '70', unit: 'g' },
      { name: 'Olivový olej', amount: '5', unit: 'g' },
      { name: 'Zelenina', amount: '100', unit: 'g' },
    ],
    instructions: '1. Uvař rýži podle návodu.\n2. Kuřecí maso nakrájej na kousky a okořeň.\n3. Maso opeč na oleji.\n4. Podávej společně se zeleninou a rýží.',
  },
  {
    id: '2',
    name: 'Ovesná kaše s banánem',
    category: 'Snídaně',
    portions: 1,
    ingredients: [
      { name: 'Ovesné vločky', amount: '60', unit: 'g' },
      { name: 'Mléko', amount: '200', unit: 'ml' },
      { name: 'Banán', amount: '100', unit: 'g' },
    ],
    instructions: '1. Vločky zalij mlékem.\n2. Za stálého míchání krátce povař.\n3. Přidej nakrájený banán.',
  },
  {
    id: '3',
    name: 'Těstovinový salát s tuňákem',
    category: 'Oběd',
    portions: 1,
    ingredients: [
      { name: 'Těstoviny', amount: '80', unit: 'g' },
      { name: 'Tuňák ve vlastní šťávě', amount: '100', unit: 'g' },
      { name: 'Rajče', amount: '100', unit: 'g' },
      { name: 'Bílý jogurt', amount: '40', unit: 'g' },
    ],
    instructions: '1. Uvař těstoviny a nech je vychladnout.\n2. Přidej tuňáka a nakrájenou zeleninu.\n3. Promíchej s jogurtem.',
  },
  {
    id: '4',
    name: 'Tvaroh s ovocem',
    category: 'Svačina',
    portions: 1,
    ingredients: [
      { name: 'Polotučný tvaroh', amount: '150', unit: 'g' },
      { name: 'Jahody', amount: '100', unit: 'g' },
      { name: 'Med', amount: '5', unit: 'g' },
    ],
    instructions: '1. Tvaroh dej do misky.\n2. Přidej nakrájené ovoce.\n3. Podle chuti přidej trochu medu.',
  },
  {
    id: '5',
    name: 'Krůtí maso s bramborami',
    category: 'Oběd',
    portions: 1,
    ingredients: [
      { name: 'Krůtí prsa', amount: '150', unit: 'g' },
      { name: 'Brambory', amount: '200', unit: 'g' },
      { name: 'Olivový olej', amount: '5', unit: 'g' },
    ],
    instructions: '1. Brambory uvař v osolené vodě.\n2. Krůtí maso okořeň.\n3. Maso opeč na oleji a podávej s bramborami.',
  },
  {
    id: '6',
    name: 'Vaječná omeleta',
    category: 'Snídaně',
    portions: 1,
    ingredients: [
      { name: 'Vejce', amount: '2', unit: 'ks' },
      { name: 'Šunka', amount: '40', unit: 'g' },
      { name: 'Sýr', amount: '20', unit: 'g' },
    ],
    instructions: '1. Vejce rozšlehej.\n2. Přidej nakrájenou šunku.\n3. Směs nalij na pánev a přidej sýr.\n4. Omeletu opeč z obou stran.',
  },
];

const days = ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'];

const mealSlots = [
  { id: 'breakfast', name: 'Snídaně' },
  { id: 'snack1', name: 'Dopolední svačina' },
  { id: 'lunch', name: 'Oběd' },
  { id: 'snack2', name: 'Odpolední svačina' },
  { id: 'dinner', name: 'Večeře' },
];

const createEmptyWeek = () =>
  days.map(() => ({
    breakfast: null,
    snack1: null,
    lunch: null,
    snack2: null,
    dinner: null,
  }));

export default function App() {
  const [session, setSession] = useState(null);
  const [householdId, setHouseholdId] = useState(null);
  const [cloudWeekLoaded, setCloudWeekLoaded] = useState(false);
const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Domů');
  const [recipes, setRecipes] = useState(initialRecipes);
const [recipesLoaded, setRecipesLoaded] = useState(false);
  const [week, setWeek] = useState(createEmptyWeek());
  const [selectedWeek, setSelectedWeek] = useState(0);
const [monthlyWeeks, setMonthlyWeeks] = useState([
  createEmptyWeek(),
  createEmptyWeek(),
  createEmptyWeek(),
  createEmptyWeek()
]);

const [monthlyWeeksLoaded, setMonthlyWeeksLoaded] = useState(false);
  const [otherWeeks, setOtherWeeks] = useState([]);
  const [weekLoaded, setWeekLoaded] = useState(false);
    const [checkedItems, setCheckedItems] = useState({});
    const [checkedItemsLoaded, setCheckedItemsLoaded] = useState(false);
    const [itemStores, setItemStores] = useState({});
    const [itemStoresLoaded, setItemStoresLoaded] = useState(false);
    const [shoppingCloudLoaded, setShoppingCloudLoaded] = useState(false);
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [pickerSlot, setPickerSlot] = useState(null);
  const [pickerSearch, setPickerSearch] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Vše');
  const [formVisible, setFormVisible] = useState(false);
  const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [authError, setAuthError] = useState('');
const [isRegistering, setIsRegistering] = useState(false);
const [authSubmitting, setAuthSubmitting] = useState(false);
  useEffect(() => {
  supabase.auth.getSession().then(({ data }) => {
    
    setSession(data.session);
    setAuthLoading(false);
  });

  const { data: { subscription } } =
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setAuthLoading(false);
    });

  return () => subscription.unsubscribe();
}, []);
useEffect(() => {
  const loadHousehold = async () => {
    if (!session?.user?.id) return;

    const { data, error } = await supabase
      .from('household_members')
      .select('household_id')
      .eq('user_id', session.user.id)
      .single();

    if (error) {
      console.log('Chyba při načítání domácnosti:', error.message);
      return;
    }

    setHouseholdId(data.household_id);
    console.log('Načtená domácnost:', data.household_id);
  };

  loadHousehold();
}, [session]);
  useEffect(() => {
  const loadWeek = async () => {
    try {
      const savedWeek = await AsyncStorage.getItem('week');

      if (savedWeek !== null) {
        setWeek(JSON.parse(savedWeek));
      }
    } catch (error) {
      console.log('Chyba při načítání plánu:', error);
    } finally {
      setWeekLoaded(true);
    }
  };

  loadWeek();
}, []);
useEffect(() => {
  const loadCloudWeek = async () => {
    if (!session?.user?.id || !householdId || !weekLoaded) return;

    const { data, error } = await supabase
      .from('weekly_plans')
      .select('week_data')
      .eq('household_id', householdId)
      .eq('user_id', session.user.id)
      .maybeSingle();

    if (error) {
      console.log('Chyba při načítání plánu z cloudu:', error.message);
      return;
    }

    if (data) {
  const savedData = data.week_data;

  if (savedData.weeks && Array.isArray(savedData.weeks)) {
    setMonthlyWeeks(savedData.weeks);
    const activeIndex = savedData.activeWeekIndex ?? 0;
    setSelectedWeek(activeIndex);
    setWeek(savedData.weeks[activeIndex] || createEmptyWeek());
  } else {
    setWeek(savedData);
    setMonthlyWeeks([
      savedData,
      createEmptyWeek(),
      createEmptyWeek(),
      createEmptyWeek()
    ]);
    setSelectedWeek(0);
  }

  console.log('Jídelní plán načten z cloudu.');
} else {
  console.log('V cloudu zatím není uložený plán.');
}

setMonthlyWeeksLoaded(true);

setCloudWeekLoaded(true);
  };

  loadCloudWeek();
}, [session, householdId, weekLoaded]);
const handleAuth = async () => {
  setAuthError('');
  setAuthSubmitting(true);

  try {
    if (isRegistering) {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
      });

      if (error) throw error;

      Alert.alert(
        'Registrace',
        'Účet byl vytvořen. Pokud Supabase vyžaduje potvrzení e-mailu, zkontroluj svou schránku.'
      );
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) throw error;
    }
  } catch (error) {
    setAuthError(error.message);
  } finally {
    setAuthSubmitting(false);
  }
};
useEffect(() => {
  const loadOtherWeeks = async () => {
    if (!session?.user?.id || !householdId || !cloudWeekLoaded) return;

    const { data, error } = await supabase
      .from('weekly_plans')
      .select('user_id, week_data')
      .eq('household_id', householdId);

    if (error) {
      console.log('Chyba při načítání plánů domácnosti:', error.message);
      return;
    }

    // Každý člen má vlastní uložený plán. V databázi je nový formát
    // zabalený do objektu { weeks, activeWeekIndex }, zatímco starší
    // záznamy mohou být přímo polem dnů. Pro nákupy potřebujeme vždy
    // samotné pole dnů právě vybraného týdne.
    const plans = (data || [])
      .filter(plan => plan.user_id !== session.user.id)
      .map(plan => {
        const savedData = plan.week_data;

        if (savedData && Array.isArray(savedData.weeks)) {
          const activeIndex = Number.isInteger(savedData.activeWeekIndex)
            ? savedData.activeWeekIndex
            : 0;

          return savedData.weeks[activeIndex] || createEmptyWeek();
        }

        return Array.isArray(savedData) ? savedData : createEmptyWeek();
      });

    setOtherWeeks(plans);
    console.log('Načteny aktivní týdny ostatních členů:', plans.length);
  };

  loadOtherWeeks();
}, [session, householdId, cloudWeekLoaded]);
// Načtení společného nákupního seznamu z databáze a živé synchronizace.
useEffect(() => {
  if (!session?.user?.id || !householdId) return;

  let active = true;
  setShoppingCloudLoaded(false);

  const loadSharedShopping = async () => {
    const { data, error } = await supabase
      .from('shared_shopping_items')
      .select('item_key, checked, store')
      .eq('household_id', householdId);

    if (error) {
      console.log('Chyba při načítání společných nákupů:', error.message);
      return;
    }

    if (!active) return;

    const nextChecked = {};
    const nextStores = {};
    (data || []).forEach(row => {
      nextChecked[row.item_key] = !!row.checked;
      if (row.store) nextStores[row.item_key] = row.store;
    });

    setCheckedItems(nextChecked);
    setItemStores(nextStores);
    setShoppingCloudLoaded(true);
  };

  loadSharedShopping();

  const channel = supabase
    .channel(`shared-shopping-${householdId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'shared_shopping_items',
        filter: `household_id=eq.${householdId}`,
      },
      payload => {
        if (!active || !payload.new?.item_key && !payload.old?.item_key) return;

        const row = payload.new || payload.old;
        const key = row.item_key;
        if (!key) return;

        if (payload.eventType === 'DELETE') {
          setCheckedItems(old => {
            const next = { ...old };
            delete next[key];
            return next;
          });
          setItemStores(old => {
            const next = { ...old };
            delete next[key];
            return next;
          });
        } else {
          setCheckedItems(old => ({ ...old, [key]: !!payload.new.checked }));
          setItemStores(old => {
            const next = { ...old };
            if (payload.new.store) next[key] = payload.new.store;
            else delete next[key];
            return next;
          });
        }
      }
    )
    .subscribe(status => {
      console.log('Synchronizace nákupů:', status);
    });

  return () => {
    active = false;
    supabase.removeChannel(channel);
  };
}, [session?.user?.id, householdId]);

// Uložení jedné změněné položky do společné tabulky.
const saveSharedShoppingItem = async (item, checkedValue, storeValue) => {
  if (!householdId || !shoppingCloudLoaded) return;

  const { error } = await supabase
    .from('shared_shopping_items')
    .upsert({
      household_id: householdId,
      item_key: item.key,
      name: item.name,
      unit: item.unit,
      checked: checkedValue,
      store: storeValue,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'household_id,item_key' });

  if (error) {
    console.log('Chyba při ukládání společného nákupu:', error.message);
  }
};
useEffect(() => {
  if (!weekLoaded || !cloudWeekLoaded || !monthlyWeeksLoaded || !session?.user?.id || !householdId) return;

  const saveWeek = async () => {
    try {
      await AsyncStorage.setItem('week', JSON.stringify(week));

      const { error } = await supabase
        .from('weekly_plans')
        .upsert({
          household_id: householdId,
          user_id: session.user.id,
          week_data: {
  weeks: monthlyWeeks,
  activeWeekIndex: selectedWeek
},
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'household_id,user_id'
        });

      if (error) throw error;

      console.log('Týdenní plán uložen do cloudu.');
    } catch (error) {
      console.log('Chyba při ukládání plánu:', error.message);
    }
  };

  saveWeek();
}, [week, monthlyWeeks, selectedWeek, weekLoaded, cloudWeekLoaded, monthlyWeeksLoaded, session, householdId]);
  useEffect(() => {
  const loadRecipes = async () => {
    try {
      const savedRecipes = await AsyncStorage.getItem('recipes');

      const currentRecipes = savedRecipes !== null
  ? JSON.parse(savedRecipes)
  : initialRecipes;

const existingIds = new Set(
  currentRecipes.map(recipe => recipe.id)
);

const newRecipes = importedRecipes.filter(
  recipe => !existingIds.has(recipe.id)
);

setRecipes([...currentRecipes, ...newRecipes]);
    } catch (error) {
      console.log('Chyba při načítání receptů:', error);
    } finally {
      setRecipesLoaded(true);
    }
  };

  loadRecipes();
}, []);
useEffect(() => {
  if (!recipesLoaded) return;

  const saveRecipes = async () => {
    try {
      await AsyncStorage.setItem('recipes', JSON.stringify(recipes));
    } catch (error) {
      console.log('Chyba při ukládání receptů:', error);
    }
  };

  saveRecipes();
}, [recipes, recipesLoaded]);

  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Oběd');
  const [newPortions, setNewPortions] = useState('1');
  const [ingredientText, setIngredientText] = useState('');
  const [newInstructions, setNewInstructions] = useState('');

  const updateMeal = (slot, recipeId) => {
  setWeek(old => {
    const updatedWeek = old.map((day, index) =>
      index === selectedDay
        ? { ...day, [slot]: recipeId }
        : day
    );

    setMonthlyWeeks(oldWeeks =>
      oldWeeks.map((weekData, index) =>
        index === selectedWeek ? updatedWeek : weekData
      )
    );

    return updatedWeek;
  });
};

  const openRecipePicker = slot => {
    setPickerSlot(slot);
    setActiveTab('Výběr receptu');
  };

  const chooseRecipe = recipeId => {
    updateMeal(pickerSlot, recipeId);
    setPickerSlot(null);
    setActiveTab('Plánování');
  };

  const saveRecipe = () => {
    if (!newName.trim()) {
      Alert.alert('Chybí název', 'Zadej název receptu.');
      return;
    }

    const ingredients = ingredientText
      .split('\n')
      .map(line => {
        const parts = line.split('|').map(part => part.trim());
        if (parts.length !== 3 || !parts[0] || !parts[1] || !parts[2]) {
          return null;
        }
        return {
          name: parts[0],
          amount: parts[1],
          unit: parts[2],
        };
      })
      .filter(Boolean);

    if (ingredients.length === 0) {
      Alert.alert(
        'Chybí suroviny',
        'Zadej alespoň jednu surovinu ve správném formátu.'
      );
      return;
    }

    const recipe = {
      id: String(Date.now()),
      name: newName.trim(),
      category: newCategory,
      portions: Math.max(1, Number(newPortions) || 1),
      ingredients,
      instructions: newInstructions.trim() || 'Postup zatím nebyl vyplněn.',
    };

    setRecipes(old => [...old, recipe]);
    setNewName('');
    setNewCategory('Oběd');
    setNewPortions('1');
    setIngredientText('');
    setNewInstructions('');
    setFormVisible(false);
    setSelectedRecipe(recipe);
    Alert.alert('Hotovo', 'Recept byl přidán.');
  };

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory =
      category === 'Vše' || recipe.category === category;
    return matchesSearch && matchesCategory;
  });

  const selectedRecipeData = id =>
    recipes.find(recipe => recipe.id === id);

  const header = title => (
    <Text style={styles.header}>{title}</Text>
  );

  const tabButton = (name, icon) => (
    <TouchableOpacity
      key={name}
      style={styles.tab}
      onPress={() => {
        setActiveTab(name);
        setSelectedRecipe(null);
        setFormVisible(false);
      }}
    >
      <Text style={[
        styles.tabIcon,
        activeTab === name && styles.activeText
      ]}>{icon}</Text>
      <Text style={[
        styles.tabText,
        activeTab === name && styles.activeText
      ]}>{name}</Text>
    </TouchableOpacity>
  );

  const recipeCard = recipe => (
    <TouchableOpacity
      key={recipe.id}
      style={styles.recipeCard}
      onPress={() => setSelectedRecipe(recipe)}
    >
      <View style={styles.plate}>
        <Text style={{ fontSize: 27 }}>🍽️</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.recipeName}>{recipe.name}</Text>
        <Text style={styles.muted}>
          {recipe.category} · {recipe.portions} porce
        </Text>
        <Text style={styles.blueText}>
          {recipe.ingredients.length} surovin · Zobrazit detail
        </Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );

  const renderRecipeDetail = recipe => (
    <View>
      <TouchableOpacity
        onPress={() => setSelectedRecipe(null)}
        style={styles.backButton}
      >
        <Text style={styles.blueText}>‹ Zpět na recepty</Text>
      </TouchableOpacity>

      <View style={styles.detailHero}>
        <Text style={{ fontSize: 48 }}>🍽️</Text>
        <Text style={styles.detailTitle}>{recipe.name}</Text>
        <Text style={styles.muted}>
          {recipe.category} · {recipe.portions} porce
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Suroviny</Text>
      <View style={styles.whiteCard}>
        {recipe.ingredients.map((item, index) => (
          <View key={index} style={styles.ingredientRow}>
            <Text style={styles.ingredientName}>{item.name}</Text>
            <Text style={styles.amount}>
              {item.amount} {item.unit}
            </Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Postup přípravy</Text>
      <View style={styles.whiteCard}>
        <Text style={styles.instructions}>{recipe.instructions}</Text>
      </View>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => {
          setSelectedRecipe(null);
          setActiveTab('Plánování');
        }}
      >
        <Text style={styles.primaryButtonText}>Přejít na plánování</Text>
      </TouchableOpacity>
    </View>
  );

  const renderRecipeForm = () => (
    <View>
      <TouchableOpacity
        onPress={() => setFormVisible(false)}
        style={styles.backButton}
      >
        <Text style={styles.blueText}>‹ Zpět na recepty</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Nový recept</Text>

      <Text style={styles.fieldLabel}>Název receptu</Text>
      <TextInput
        style={styles.input}
        placeholder="Např. Kuřecí rizoto"
        value={newName}
        onChangeText={setNewName}
      />

      <Text style={styles.fieldLabel}>Kategorie</Text>
      <View style={styles.categoryRow}>
        {['Snídaně', 'Svačina', 'Oběd', 'Večeře'].map(item => (
          <TouchableOpacity
            key={item}
            onPress={() => setNewCategory(item)}
            style={[
              styles.categoryButton,
              newCategory === item && styles.categoryActive
            ]}
          >
            <Text style={[
              styles.categoryText,
              newCategory === item && styles.categoryTextActive
            ]}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.fieldLabel}>Počet porcí</Text>
      <TextInput
        style={styles.input}
        value={newPortions}
        onChangeText={setNewPortions}
        keyboardType="numeric"
        placeholder="1"
      />

      <Text style={styles.fieldLabel}>Suroviny</Text>
      <Text style={styles.helper}>
        Každou surovinu napiš na samostatný řádek ve formátu:
      </Text>
      <Text style={styles.example}>
        Kuřecí maso | 150 | g
      </Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        multiline
        value={ingredientText}
        onChangeText={setIngredientText}
        placeholder={'Kuřecí maso | 150 | g\nRýže | 70 | g\nOlej | 5 | g'}
      />

      <Text style={styles.fieldLabel}>Postup přípravy</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        multiline
        value={newInstructions}
        onChangeText={setNewInstructions}
        placeholder={'1. Připrav suroviny.\n2. Uvař a podávej.'}
      />

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={saveRecipe}
      >
        <Text style={styles.primaryButtonText}>Uložit recept</Text>
      </TouchableOpacity>
    </View>
  );
  // Automatický součet surovin z celého týdenního plánu
  const shoppingItems = Object.values(
    [week, ...otherWeeks].flat().reduce((result, day) => {
      mealSlots.forEach(slot => {
        const recipeId = day[slot.id];
        if (!recipeId) return;

        const recipe = recipes.find(r => r.id === recipeId);
        if (!recipe) return;

        recipe.ingredients.forEach(item => {
          const name = item.name.trim();
          const unit = item.unit.trim();
          const key = `${name.toLowerCase()}_${unit.toLowerCase()}`;
          const amount = Number(String(item.amount).replace(',', '.'));

          if (!Number.isFinite(amount)) return;

          if (!result[key]) {
  result[key] = {
    key,
    name,
    unit,
    amount: 0,
  };
}

          result[key].amount += amount;
        });
      });

      return result;
    }, {})
    ).sort((a, b) => {
    const aChecked = !!checkedItems[a.key];
    const bChecked = !!checkedItems[b.key];

    if (aChecked !== bChecked) {
      return aChecked ? 1 : -1;
    }

    return a.name.localeCompare(b.name, 'cs');
  });
  if (authLoading) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Načítám...</Text>
    </View>
  );
}

if (!session) {
  return (
    <View style={{ flex: 1, backgroundColor: '#F3F7FC', justifyContent: 'center', padding: 25 }}>
      <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 10 }}>
        Jídelníček
      </Text>

      <Text style={{ marginBottom: 25, color: '#8290A3' }}>
        {isRegistering ? 'Vytvoř si nový účet' : 'Přihlas se ke svému účtu'}
      </Text>

      <TextInput
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{ backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 12 }}
      />

      <TextInput
        placeholder="Heslo"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 12 }}
      />

      {!!authError && (
        <Text style={{ color: 'red', marginBottom: 12 }}>{authError}</Text>
      )}

      <TouchableOpacity
        style={{ backgroundColor: '#1769C2', padding: 15, borderRadius: 10, alignItems: 'center' }}
        onPress={handleAuth}
        disabled={authSubmitting}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>
          {authSubmitting ? 'Čekej...' : isRegistering ? 'Registrovat' : 'Přihlásit se'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          setIsRegistering(!isRegistering);
          setAuthError('');
        }}
        style={{ marginTop: 20, alignItems: 'center' }}
      >
        <Text style={{ color: '#1769C2' }}>
          {isRegistering ? 'Už máš účet? Přihlas se' : 'Nemáš účet? Zaregistruj se'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
  return (
    
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F7FC" />

      <View style={styles.topBar}>
        <View>
          <Text style={styles.logo}>Jídelníček</Text>
          <Text style={styles.muted}>Tvůj plán, tvoje jídlo</Text>
        </View>
        <TouchableOpacity
  style={styles.avatar}
  onPress={async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      setSession(null);
      Alert.alert('Odhlášení', 'Byl jsi úspěšně odhlášen.');
    } catch (error) {
      Alert.alert('Chyba při odhlášení', error.message);
    }
  }}
>
  <Text style={styles.avatarText}>Odhlásit</Text>
</TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 25 }}
      >
        {activeTab === 'Domů' && (
          <>
            {header('Ahoj! 👋')}
            <Text style={styles.subtitle}>
              Co si dnes dáme dobrého?
            </Text>
            <View style={styles.whiteCard}>
              <Text style={styles.sectionTitle}>Tvoje aplikace</Text>
              <Text style={styles.muted}>
                Zatím máš {recipes.length} receptů v databázi.
              </Text>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => setActiveTab('Recepty')}
              >
                <Text style={styles.primaryButtonText}>
                  Prohlédnout recepty
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {activeTab === 'Recepty' && (
          <>
            {selectedRecipe
              ? renderRecipeDetail(selectedRecipe)
              : formVisible
                ? renderRecipeForm()
                : (
                  <>
                    {header('Moje recepty')}
                    <Text style={styles.subtitle}>
                      Všechny recepty na jednom místě
                    </Text>

                    <TextInput
                      style={styles.input}
                      placeholder="⌕  Hledat recept..."
                      value={search}
                      onChangeText={setSearch}
                    />

                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      style={{ marginVertical: 12 }}
                    >
                      {['Vše', 'Snídaně', 'Svačina', 'Oběd', 'Večeře'].map(item => (
                        <TouchableOpacity
                          key={item}
                          onPress={() => setCategory(item)}
                          style={[
                            styles.filterButton,
                            category === item && styles.filterActive
                          ]}
                        >
                          <Text style={[
                            styles.filterText,
                            category === item && styles.filterTextActive
                          ]}>{item}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>

                    <TouchableOpacity
                      style={styles.primaryButton}
                      onPress={() => setFormVisible(true)}
                    >
                      <Text style={styles.primaryButtonText}>
                        + Přidat vlastní recept
                      </Text>
                    </TouchableOpacity>

                    <Text style={styles.sectionTitle}>
                      Seznam receptů ({filteredRecipes.length})
                    </Text>

                    {filteredRecipes.length > 0
                      ? filteredRecipes.map(recipeCard)
                      : <Text style={styles.muted}>Žádný recept nenalezen.</Text>
                    }
                  </>
                )
            }
          </>
        )}

        {activeTab === 'Plánování' && (
          <>
            {header('Týdenní plán')}
            <Text style={styles.subtitle}>
              Vyber si jídlo pro každý den
            </Text>
<View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
  {[0, 1, 2, 3].map((index) => (
    <TouchableOpacity
      key={index}
      onPress={() => {
  setMonthlyWeeks(oldWeeks =>
    oldWeeks.map((weekData, i) =>
      i === selectedWeek ? week : weekData
    )
  );
  setSelectedWeek(index);
  setWeek(monthlyWeeks[index]);
  setSelectedDay(0);
}}
      style={{
        flex: 1,
        padding: 10,
        borderRadius: 8,
        backgroundColor: selectedWeek === index ? '#2563eb' : '#e5e7eb',
        alignItems: 'center',
      }}
    >
      <Text style={{
        color: selectedWeek === index ? '#ffffff' : '#333333',
        fontWeight: 'bold',
      }}>
        {index + 1}. týden
      </Text>
    </TouchableOpacity>
  ))}
</View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginVertical: 12 }}
            >
              {days.map((day, index) => (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.dayButton,
                    selectedDay === index && styles.dayActive
                  ]}
                  onPress={() => setSelectedDay(index)}
                >
                  <Text style={[
                    styles.dayText,
                    selectedDay === index && styles.dayTextActive
                  ]}>{day}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {mealSlots.map(slot => {
              const recipeId = week[selectedDay][slot.id];
              const recipe = selectedRecipeData(recipeId);

              return (
                <View key={slot.id} style={styles.mealCard}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.mealTitle}>{slot.name}</Text>
                    <Text style={styles.muted}>
                      {recipe ? recipe.name : 'Zatím nevybráno'}
                    </Text>
                  </View>
                  {recipe && (
                    <TouchableOpacity
                      onPress={() => updateMeal(slot.id, null)}
                      style={styles.removeButton}
                    >
                      <Text style={styles.removeText}>Odebrat</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    onPress={() => openRecipePicker(slot.id)}
                    style={styles.addButton}
                  >
                    <Text style={styles.addButtonText}>
                      {recipe ? 'Změnit' : '+ Vybrat'}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </>
        )}

        {activeTab === 'Výběr receptu' && (
          <>
            <TouchableOpacity
              onPress={() => setActiveTab('Plánování')}
              style={styles.backButton}
            >
              <Text style={styles.blueText}>‹ Zpět na plánování</Text>
            </TouchableOpacity>
            {header('Vyber recept')}
            <Text style={styles.subtitle}>
              {mealSlots.find(s => s.id === pickerSlot)?.name}
            </Text>
            <TextInput
  style={styles.input}
  placeholder="Hledat recept..."
  value={pickerSearch}
  onChangeText={setPickerSearch}
/>
            {recipes.filter(recipe =>
  recipe.name.toLowerCase().includes(pickerSearch.toLowerCase())
).map(recipe => (
              <TouchableOpacity
                key={recipe.id}
                style={styles.recipeCard}
                onPress={() => chooseRecipe(recipe.id)}
              >
                <View style={styles.plate}>
                  <Text style={{ fontSize: 25 }}>🍽️</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.recipeName}>{recipe.name}</Text>
                  <Text style={styles.muted}>{recipe.category}</Text>
                </View>
                <Text style={styles.blueText}>Vybrat</Text>
              </TouchableOpacity>
            ))}
          </>
        )}

        
        {activeTab === 'Nákupy' && (
          <>
            {header('Nákupní seznam')}
            <Text style={styles.subtitle}>
              Suroviny podle týdenních plánů domácnosti
            </Text>

            <View style={styles.whiteCard}>
              <Text style={styles.sectionTitle}>
                Celkem surovin: {shoppingItems.length}
              </Text>

              {shoppingItems.length === 0 ? (
                <Text style={styles.muted}>
                  Zatím tu nic není. Nejdříve si vyber jídla v týdenním plánu.
                </Text>
              ) : (
                
shoppingItems.map(item => {
  const checked = !!checkedItems[item.key];

  return (
    <TouchableOpacity
      key={item.key}
      style={styles.ingredientRow}
      onPress={() => {
        const nextChecked = !checked;
        setCheckedItems(old => ({ ...old, [item.key]: nextChecked }));
        saveSharedShoppingItem(item, nextChecked, itemStores[item.key] || null);
      }}
    >
      <View style={styles.shoppingLeft}>
        <View style={[
          styles.shoppingCheckbox,
          checked && styles.shoppingCheckboxActive
        ]}>
          {checked && (
            <Text style={styles.checkmark}>✓</Text>
          )}
        </View>

        <Text style={[
          styles.ingredientName,
          checked && styles.shoppingCheckedText
        ]}>
          {item.name}
        </Text>
      </View>

      <Text style={[
        styles.amount,
        checked && styles.shoppingCheckedText
      ]}>
        {Number(item.amount.toFixed(2))} {item.unit}
      </Text>      
<View style={styles.storeButtons}>
  {[
    { id: 'Globus', letter: 'G', color: '#F59E0B' },
    { id: 'Albert', letter: 'A', color: '#2563EB' },
  ].map(store => {
    const selected = itemStores[item.key] === store.id;

    return (
      <TouchableOpacity
        key={store.id}
        style={[
          styles.storeButton,
          { borderColor: store.color },
          selected && { backgroundColor: store.color }
        ]}
        onPress={() => {
          const nextStore = selected ? null : store.id;
          setItemStores(old => ({ ...old, [item.key]: nextStore }));
          saveSharedShoppingItem(item, checked, nextStore);
        }}
      >
        <Text style={[
          styles.storeButtonText,
          { color: selected ? '#FFFFFF' : store.color }
        ]}>
          {selected ? '✓' : store.letter}
        </Text>
      </TouchableOpacity>
    );
  })}
</View>

    </TouchableOpacity>
  );
})

              )}
            </View>

            <Text style={styles.muted}>
              Seznam se automaticky aktualizuje podle změn v plánování.
            </Text>
          </>
        )}


        {activeTab === 'Statistiky' && (
          <>
            {header('Statistiky')}
            <View style={styles.whiteCard}>
              <Text style={styles.muted}>
                Výživové hodnoty doplníme až podle ověřených údajů receptů.
              </Text>
            </View>
          </>
        )}
      </ScrollView>

      <View style={styles.bottomBar}>
        {tabButton('Domů', '⌂')}
        {tabButton('Recepty', '▤')}
        {tabButton('Plánování', '▦')}
        {tabButton('Nákupy', '🛒')}
        {tabButton('Statistiky', '▥')}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F3F7FC' },
  topBar: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: { fontSize: 23, fontWeight: 'bold', color: '#1769C2' },
  muted: { color: '#8290A3', fontSize: 13, marginTop: 4 },
  avatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#DCEBFA',
    justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { color: '#1769C2', fontWeight: 'bold', fontSize: 17 },
  content: { flex: 1, paddingHorizontal: 18 },
  header: { fontSize: 25, fontWeight: 'bold', color: '#1C2B3A', marginTop: 12 },
  subtitle: { color: '#8290A3', fontSize: 14, marginTop: 5, marginBottom: 15 },
  whiteCard: {
    backgroundColor: '#FFFFFF', borderRadius: 16,
    padding: 16, marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18, fontWeight: 'bold',
    color: '#1C2B3A', marginTop: 18, marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: '#1769C2', padding: 15,
    borderRadius: 12, alignItems: 'center', marginVertical: 10,
  },
  primaryButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 15 },
  recipeCard: {
    backgroundColor: '#FFFFFF', borderRadius: 15,
    padding: 12, marginBottom: 10,
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  plate: {
    width: 52, height: 52, borderRadius: 13,
    backgroundColor: '#EAF3FC', justifyContent: 'center',
    alignItems: 'center',
  },
  recipeName: { color: '#1C2B3A', fontWeight: 'bold', fontSize: 15 },
  blueText: { color: '#1769C2', fontWeight: '600', marginTop: 5 },
  arrow: { fontSize: 25, color: '#9AA9B9' },
  detailHero: {
    alignItems: 'center', backgroundColor: '#EAF3FC',
    padding: 25, borderRadius: 18, marginTop: 10,
  },
  detailTitle: {
    fontSize: 21, fontWeight: 'bold',
    color: '#1C2B3A', marginTop: 12, textAlign: 'center',
  },
  ingredientRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#EDF1F5',
  },
  ingredientName: { color: '#34465A', fontSize: 14 },
  amount: { color: '#1769C2', fontWeight: 'bold', fontSize: 14 },
  instructions: { color: '#34465A', fontSize: 15, lineHeight: 25 },
  backButton: { paddingVertical: 10 },
  input: {
    backgroundColor: '#FFFFFF', borderRadius: 11,
    padding: 14, fontSize: 15, color: '#26384A',
    marginBottom: 10, borderWidth: 1, borderColor: '#E5ECF4',
  },
  multiline: { minHeight: 115, textAlignVertical: 'top' },
  fieldLabel: {
    color: '#26384A', fontWeight: 'bold',
    fontSize: 14, marginTop: 12, marginBottom: 7,
  },
  helper: { color: '#8290A3', fontSize: 13 },
  example: {
    color: '#1769C2', fontSize: 13,
    marginVertical: 7, fontWeight: '600',
  },
  categoryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  categoryButton: {
    paddingHorizontal: 12, paddingVertical: 9,
    backgroundColor: '#FFFFFF', borderRadius: 10,
  },
  categoryActive: { backgroundColor: '#1769C2' },
  categoryText: { color: '#526477', fontSize: 12 },
  categoryTextActive: { color: '#FFFFFF', fontWeight: 'bold' },
  filterButton: {
    paddingHorizontal: 15, paddingVertical: 9,
    borderRadius: 20, backgroundColor: '#FFFFFF', marginRight: 8,
  },
  filterActive: { backgroundColor: '#1769C2' },
  filterText: { color: '#526477' },
  filterTextActive: { color: '#FFFFFF', fontWeight: 'bold' },
  dayButton: {
    width: 43, height: 43, borderRadius: 13,
    backgroundColor: '#FFFFFF', justifyContent: 'center',
    alignItems: 'center', marginRight: 8,
  },
  dayActive: { backgroundColor: '#1769C2' },
  dayText: { color: '#526477', fontWeight: 'bold' },
  dayTextActive: { color: '#FFFFFF' },
  mealCard: {
    backgroundColor: '#FFFFFF', borderRadius: 14,
    padding: 14, marginBottom: 10,
    flexDirection: 'row', alignItems: 'center', gap: 8,
  },
  mealTitle: { fontSize: 14, color: '#1C2B3A', fontWeight: 'bold' },
  addButton: {
    backgroundColor: '#EAF3FC', padding: 9,
    borderRadius: 9,
  },
  addButtonText: { color: '#1769C2', fontWeight: 'bold', fontSize: 12 },
  removeButton: { padding: 6 },
  removeText: { color: '#C45B5B', fontSize: 11 },
  bottomBar: {
    flexDirection: 'row', backgroundColor: '#FFFFFF',
    paddingTop: 9, paddingBottom: 7,
    borderTopWidth: 1, borderTopColor: '#E7EDF4',
  },
  tab: { flex: 1, alignItems: 'center', gap: 3 },
  tabIcon: { fontSize: 20, color: '#8290A3' },
  tabText: { fontSize: 10, color: '#8290A3' },
  activeText: { color: '#1769C2', fontWeight: 'bold' },
  shoppingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  shoppingCheckbox: {
    width: 23,
    height: 23,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#B8C8D9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shoppingCheckboxActive: {
    backgroundColor: '#1769C2',
    borderColor: '#1769C2',
  },
  checkmark: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  shoppingCheckedText: {
    color: '#A0AAB5',
    textDecorationLine: 'line-through',
  },  storeButtons: {
  flexDirection: 'row',
  gap: 6,
  alignItems: 'center',
},
storeButton: {
  width: 29,
  height: 29,
  borderRadius: 8,
  borderWidth: 1.5,
  backgroundColor: '#FFFFFF',
  alignItems: 'center',
  justifyContent: 'center',
},
storeButtonText: {
  fontSize: 13,
  fontWeight: 'bold',
  },});
