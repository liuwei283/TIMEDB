class AddTypeToAnalysis < ActiveRecord::Migration[6.0]
  def change
    add_column :analyses, :multiple_mid, :int, :default=> -1
  end
end
