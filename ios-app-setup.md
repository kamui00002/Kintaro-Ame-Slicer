# iOSアプリ作成手順

## 1. Xcodeでプロジェクト作成
1. Xcodeを開く
2. "Create a new Xcode project"
3. "iOS" → "App"
4. プロジェクト名: "KintaroAmeSlicer"
5. Interface: "Storyboard"
6. Language: "Swift"

## 2. WebViewを追加
ViewController.swift:
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

## 3. StoryboardでWebViewを配置
1. Main.storyboardを開く
2. WebKit Viewをドラッグ&ドロップ
3. ViewControllerに接続

## 4. ビルドファイルを追加
1. distフォルダの内容をプロジェクトに追加
2. Build PhasesでCopy Bundle Resourcesに追加

## 5. App Store Connectで配信
1. App Store Connectでアプリを登録
2. アプリ情報を入力
3. スクリーンショットをアップロード
4. 審査に提出
