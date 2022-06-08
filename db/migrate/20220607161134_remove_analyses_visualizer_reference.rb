class RemoveAnalysesVisualizerReference < ActiveRecord::Migration[6.0]
  def change
    change_table :analyses do |t|
      t.remove_references :visualizer
    end
  end

end
