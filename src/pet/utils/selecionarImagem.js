import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";

export async function selecionarImagemLeve() {
  const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permissao.granted) {
    return null;
  }

  const resultado = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.7,
  });

  if (resultado.canceled || !resultado.assets?.[0]?.uri) {
    return null;
  }

  const imagem = await ImageManipulator.manipulateAsync(
    resultado.assets[0].uri,
    [{ resize: { width: 720, height: 720 } }],
    {
      compress: 0.6,
      format: ImageManipulator.SaveFormat.WEBP,
      base64: true,
    }
  );

  return imagem.base64 ? `data:image/webp;base64,${imagem.base64}` : imagem.uri;
}
