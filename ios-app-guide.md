# iOS版配信ガイド

## 方法1: App Store配信

### 1. Apple Developer Program登録
- https://developer.apple.com/ でアカウント作成
- 年間$99の料金が必要

### 2. XcodeでiOSアプリを作成

#### ステップ1: 新しいプロジェクト作成
1. Xcodeを開く
2. "Create a new Xcode project"を選択
3. "iOS" → "App"を選択
4. プロジェクト名: "KintaroAmeSlicer"
5. Interface: "Storyboard"
6. Language: "Swift"

#### ステップ2: WebViewを追加
ViewController.swiftに以下を追加:

```swift
import UIKit
import WebKit

class ViewController: UIViewController {
    @IBOutlet weak var webView: WKWebView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // ローカルHTMLファイルを読み込み
        if let htmlPath = Bundle.main.path(forResource: "index", ofType: "html") {
            let htmlURL = URL(fileURLWithPath: htmlPath)
            webView.loadFileURL(htmlURL, allowingReadAccessTo: htmlURL.deletingLastPathComponent())
        }
    }
}
```

#### ステップ3: StoryboardでWebViewを配置
1. Main.storyboardを開く
2. WebKit Viewをドラッグ&ドロップ
3. ViewControllerに接続

#### ステップ4: ビルドファイルを追加
1. プロジェクトにHTMLファイルを追加
2. Build PhasesでCopy Bundle Resourcesに追加

### 3. App Store Connectで配信
1. App Store Connectでアプリを登録
2. アプリ情報を入力
3. スクリーンショットをアップロード
4. 審査に提出

## 方法2: TestFlight配信（ベータ版）

### 1. TestFlightで配信
1. App Store ConnectでTestFlightを有効化
2. ビルドをアップロード
3. テスターを招待

## 方法3: 企業配信（内部配信）

### 1. Enterprise Developer Program
- 年間$299の料金
- 社内配信のみ可能

## 方法4: PWA配信（無料）

### 1. Web Appとして配信
1. サーバーにデプロイ
2. PWAマニフェストを設定
3. ユーザーがSafariで「ホーム画面に追加」

### 2. 推奨ホスティングサービス
- Vercel
- Netlify
- GitHub Pages
- Firebase Hosting
