import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchImageLibrary } from 'react-native-image-picker';
import { NoteItem } from './HomeScreen';
import { uploadImageToCloud } from '../server/cloudinaryUpload';

export default function AddImageNoteScreen({ route, navigation }: any) {
  const { initialNote, onSave } = route.params || {};

  const [title, setTitle] = useState(initialNote?.title || '');
  const [content, setContent] = useState(initialNote?.content || '');
  const [imageUri, setImageUri] = useState(initialNote?.imageUri || '');

  // chose picture
  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, (res) => {
      if (res.assets && res.assets.length > 0) {
        setImageUri(res.assets[0].uri || '');
      }
    });
  };

  // 💾 Save
  const handleSave = async () => {
    if (!title?.trim() && !content?.trim() && !imageUri) {
      Alert.alert('Cannot save', 'Please add a title, some text, or an image.');
      return;
    }

    let finalImageUri = imageUri;

    // If it's a local file, upload it to Cloudinary first
    if (imageUri && imageUri.startsWith('file://')) {
      try {
        finalImageUri = await uploadImageToCloud(imageUri);
      } catch (err) {
        Alert.alert('Upload failed', 'Could not upload image.');
        return;
      }
    }
    const note: NoteItem = {
      id: initialNote?.id || Date.now().toString(),
      type: 'image',
      title: title.trim(),
      content: content.trim(),
      imageUri: finalImageUri,
      createdAt:
        initialNote?.createdAt || new Date().toISOString(),
    };

    onSave?.(note);
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1 }}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={28} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSave}>
          <MaterialCommunityIcons name="check" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Main content */}
      <View style={styles.container}>

        {/* Choose picture */}
        <TouchableOpacity onPress={pickImage} style={styles.iconBtn}>
          <MaterialCommunityIcons name="image-plus" size={30} color="#fff" />
        </TouchableOpacity>

        {/* Title */}
        <TextInput
          style={styles.titleInput}
          placeholder="Title"
          placeholderTextColor="#888"
          value={title}
          onChangeText={setTitle}
        />

        {/* Image */}
        {imageUri && (
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            resizeMode="contain"
          />
        )}

        {/* Content */}
        <TextInput
          style={styles.contentInput}
          placeholder="Write your note here..."
          placeholderTextColor="#888"
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#1e1e2f',
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#1e1e2f',
  },

  iconBtn: {
    marginBottom: 10,
  },

  titleInput: {
    color: '#fff',
    fontSize: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#555',
    marginBottom: 10,
    paddingVertical: 6,
  },

  contentInput: {
    color: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#555',
    marginTop: 10,
    paddingVertical: 10,
    minHeight: 100,
  },

  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginVertical: 12,
  },

  saveBtn: {
    marginTop: 20,
    alignSelf: 'flex-end',
  },
});