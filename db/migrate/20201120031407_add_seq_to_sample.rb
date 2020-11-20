class AddSeqToSample < ActiveRecord::Migration[6.0]
  def change
    add_column :samples, :seq_file, :string
  end
end
