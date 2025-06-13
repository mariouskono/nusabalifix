import os
import sys
import json
import numpy as np
import pandas as pd
import tensorflow as tf

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
tf.get_logger().setLevel('ERROR')

BASE_DIR = os.path.dirname(__file__)

try:
    df = pd.read_csv(os.path.join(BASE_DIR, 'dataset_tempat_wisata_bali.csv'))
    model = tf.keras.models.load_model(os.path.join(BASE_DIR, 'model_preferensi_tensorflow.h5'))
except Exception as e:
    print(json.dumps({"error": f"Gagal load model/dataset: {str(e)}"}), file=sys.stderr, flush=True)
    sys.exit(1)

kategori_list = sorted(df['kategori'].str.lower().unique())[:5]
kabupaten_list = sorted(df['kabupaten_kota'].str.lower().unique())[:8]

def encode_onehot(item, categories):
    vec = np.zeros(len(categories), dtype=float)
    try:
        idx = categories.index(item.lower())
        vec[idx] = 1.0
    except ValueError:
        pass
    return vec

def make_features(row):
    kategori = row['kategori'].lower()
    kabupaten = row['kabupaten_kota'].lower()
    rating = float(row['rating'])

    kategori_oh = encode_onehot(kategori, kategori_list)
    kabupaten_oh = encode_onehot(kabupaten, kabupaten_list)

    features = np.concatenate([kategori_oh, kabupaten_oh, [rating]])

    if len(features) < 14:
        features = np.pad(features, (0, 14 - len(features)), 'constant')
    elif len(features) > 14:
        features = features[:14]

    return features

def get_recommendations(kategori, kabupaten_kota, rating_min, top_n=20):
    try:
        df_filtered = df[
            (df['kategori'].str.lower() == kategori.lower()) &
            (df['kabupaten_kota'].str.lower() == kabupaten_kota.lower()) &
            (df['rating'] >= rating_min)
        ]

        if df_filtered.empty:
            return []

        X = np.array([make_features(row) for _, row in df_filtered.iterrows()])
        preds = model.predict(X)

        df_filtered = df_filtered.copy()
        df_filtered['pred_preferensi'] = preds[:, 0]

        df_top = df_filtered.sort_values(by='pred_preferensi', ascending=False).head(top_n)

        results = df_top[[
            'nama', 'kategori', 'kabupaten_kota', 'rating', 'link_lokasi', 'link_gambar'
        ]].to_dict(orient='records')

        return results

    except Exception as e:
        print(json.dumps({"error": f"Gagal prediksi model: {str(e)}"}), file=sys.stderr, flush=True)
        return []

def main():
    try:
        raw_input = sys.stdin.read()
        data = json.loads(raw_input)

        kategori = data.get('kategori')
        kabupaten_kota = data.get('kabupaten_kota')
        rating_min = float(data.get('rating_min', 0))
        top_n = int(data.get('top_n', 20))

        rekomendasi = get_recommendations(kategori, kabupaten_kota, rating_min, top_n)

        print(json.dumps(rekomendasi), flush=True)
    except Exception as e:
        print(json.dumps({"error": f"Kesalahan saat eksekusi: {str(e)}"}), file=sys.stderr, flush=True)

if __name__ == '__main__':
    main()
