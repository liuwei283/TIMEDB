class CreateAnalysesVisualizers < ActiveRecord::Migration[6.0]
  def change
    create_table :analyses_visualizers do |t|
      t.references :analysis, null: false, foreign_key: true
      t.references :visualizer, null: false, foreign_key: true
      t.timestamps
    end
  end
end