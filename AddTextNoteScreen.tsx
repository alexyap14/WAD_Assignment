import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NoteItem } from './HomeScreen';

export default function AddTextNoteScreen({ route, navigation }: any) {
  const { initialNote, onSave } = route.params || {};
  const [title, setTitle] = useState(initialNote?.title || '');
  const [content, setContent] = useState(initialNote?.content || '');

  const handleSave = () => {
    if (!title.trim() && !content.trim()) {
      Alert.alert('Empty Note', 'Please add a title or some text.', [
        { text: 'OK' },
      ]);
      return;
    }

    const note: NoteItem = {
      id: initialNote?.id || Date.now().toString(),
      type: 'text',
      title: title.trim(),
      content: content.trim(),
      createdAt:
        initialNote?.createdAt || new Date().toISOString(),
    };

    if (onSave) {
      onSave(note);
    }
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.iconBtn}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>
          {initialNote ? 'Edit Text Note' : 'New Text Note'}
        </Text>
        <View style={{ flex: 1 }} />
        <TouchableOpacity onPress={handleSave} style={styles.iconBtn}>
          <MaterialCommunityIcons name="check" size={24} color="#6d5fd4" />
        </TouchableOpacity>
      </View>

      {/* Title input */}
      <TextInput
        style={styles.titleInput}
        placeholder="Title"
        placeholderTextColor="#555"
        value={title}
        onChangeText={setTitle}
      />

      {/* Content input */}
      <TextInput
        style={styles.contentInput}
        placeholder="Write your note here..."
        placeholderTextColor="#555"
        value={content}
        onChangeText={setContent}
        multiline
        textAlignVertical="top"
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1b1f',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  iconBtn: {
    padding: 8,
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '500',
    marginLeft: 8,
  },
  titleInput: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '600',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a3a',
  },
  contentInput: {
    flex: 1,
    color: '#c8c8d8',
    fontSize: 16,
    paddingHorizontal: 20,
    paddingTop: 16,
    lineHeight: 24,
  },
});