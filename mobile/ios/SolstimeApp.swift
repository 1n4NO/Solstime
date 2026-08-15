import SwiftUI

struct DialSnapshot: Equatable {
    var timezoneName: String
    var localTime: String
    var dateLabel: String
    var daylightLabel: String
    var isStale: Bool
}

struct SolstimeApp: App {
    var body: some Scene {
        WindowGroup {
            DialScreen(snapshot: .preview)
        }
    }
}

struct DialScreen: View {
    let snapshot: DialSnapshot

    var body: some View {
        ZStack {
            Color(red: 0.055, green: 0.075, blue: 0.065)
                .ignoresSafeArea()

            VStack(spacing: 22) {
                Text("solstime")
                    .font(.system(size: 17, weight: .semibold, design: .rounded))
                    .foregroundStyle(Color(red: 0.95, green: 0.68, blue: 0.35))

                ZStack {
                    Circle()
                        .fill(Color(red: 0.08, green: 0.11, blue: 0.095))
                        .overlay(Circle().stroke(.white.opacity(0.14), lineWidth: 1))

                    Circle()
                        .trim(from: 0.08, to: 0.62)
                        .stroke(Color(red: 0.95, green: 0.68, blue: 0.35), style: StrokeStyle(lineWidth: 5, lineCap: .butt))
                        .rotationEffect(.degrees(-90))
                        .padding(14)

                    VStack(spacing: 8) {
                        Text(snapshot.timezoneName.uppercased())
                            .font(.system(size: 15, weight: .semibold, design: .monospaced))
                            .foregroundStyle(Color(red: 0.95, green: 0.68, blue: 0.35))
                            .lineLimit(1)
                            .minimumScaleFactor(0.7)

                        Text(snapshot.localTime)
                            .font(.system(size: 58, weight: .regular, design: .rounded))
                            .monospacedDigit()
                            .foregroundStyle(.white.opacity(0.94))
                            .accessibilityLabel("Local time \(snapshot.localTime)")

                        Text(snapshot.dateLabel)
                            .font(.system(size: 15, weight: .semibold, design: .monospaced))
                            .foregroundStyle(Color(red: 0.95, green: 0.68, blue: 0.35))

                        Text(snapshot.daylightLabel)
                            .font(.system(size: 13, weight: .regular, design: .monospaced))
                            .foregroundStyle(.white.opacity(0.6))
                    }
                    .padding(34)
                }
                .frame(width: 310, height: 310)

                if snapshot.isStale {
                    Label("Updated from saved data", systemImage: "arrow.clockwise")
                        .font(.footnote)
                        .foregroundStyle(.white.opacity(0.6))
                }
            }
            .padding(24)
        }
        .preferredColorScheme(.dark)
    }
}

private extension DialSnapshot {
    static let preview = DialSnapshot(
        timezoneName: "Bengaluru",
        localTime: "14:30",
        dateLabel: "Aug 15, SAT",
        daylightLabel: "daylight · 12h 38m",
        isStale: false
    )
}
